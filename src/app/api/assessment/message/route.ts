import { NextRequest, NextResponse } from "next/server";
import { generateClaudeResponse } from "@/lib/claude";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { Language } from "@/lib/i18n";

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      message,
      currentPhase,
      questionCount,
      language: requestLanguage,
    } = await request.json();

    console.log("Processing message for session:", sessionId);
    console.log("Current phase:", currentPhase);
    console.log("Question count:", questionCount);

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message are required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Save user message first
    const { error: userMsgError } = await supabase.from("messages").insert({
      session_id: sessionId,
      role: "user",
      content: message,
    });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      return NextResponse.json(
        { error: "Failed to save user message" },
        { status: 500 }
      );
    }

    // Get session to retrieve language, but prioritize language from request
    const { data: session } = await supabase
      .from("sessions")
      .select("language")
      .eq("id", sessionId)
      .single();

    // Use language from request if provided (most reliable), otherwise use session language, otherwise default to 'en'
    let language: Language = "en";
    if (
      requestLanguage &&
      (requestLanguage === "es" || requestLanguage === "en")
    ) {
      language = requestLanguage;
    } else if (
      session?.language &&
      (session.language === "es" || session.language === "en")
    ) {
      language = session.language;
    }

    console.log("=== ASSESSMENT MESSAGE API ===");
    console.log("Session ID:", sessionId);
    console.log("Language from request body:", requestLanguage);
    console.log("Language from request type:", typeof requestLanguage);
    console.log("Session language from DB:", session?.language);
    console.log("Final language being used:", language);
    console.log("Final language type:", typeof language);
    console.log("Is language 'es'?", language === "es");
    console.log("Is language 'en'?", language === "en");
    console.log("==============================");

    // Update session language if request language differs (async, don't wait)
    if (requestLanguage && requestLanguage !== session?.language) {
      // Use void to explicitly ignore the promise result
      void (async () => {
        try {
          const { error } = await supabaseAdmin
            .from("sessions")
            .update({ language: requestLanguage })
            .eq("id", sessionId);

          if (error) {
            console.error("Failed to update session language:", error);
          } else {
            console.log("Session language updated to:", requestLanguage);
          }
        } catch (error) {
          console.error("Failed to update session language:", error);
        }
      })();
    }

    // Get conversation history
    const { data: messages, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("ts", { ascending: true });

    if (fetchError) {
      console.error("Error fetching messages:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch conversation history" },
        { status: 500 }
      );
    }

    // Build conversation history for Claude
    const conversationHistory =
      messages?.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })) || [];

    // Generate response using Claude with language
    const response = await generateClaudeResponse(
      conversationHistory,
      language
    );

    // Save assistant response to database
    const { error: saveError } = await supabase.from("messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: response,
    });

    if (saveError) {
      console.error("Error saving message:", saveError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Check if assessment is complete
    // Check for multiple variations of the completion phrase in both languages
    const isComplete =
      // English phrases
      response.includes("Let's get you out of the weeds.") ||
      response.includes("Let's get you out of the weeds") ||
      response.includes("get you out of the weeds") ||
      response.includes("out of the weeds") ||
      response.toLowerCase().includes("let's get you out of the weeds") ||
      response.toLowerCase().includes("get you out of the weeds") ||
      // Spanish phrases
      response.includes("Vamos a sacarte de las malas hierbas.") ||
      response.includes("Vamos a sacarte de las malas hierbas") ||
      response.includes("sacarte de las malas hierbas") ||
      response.includes("de las malas hierbas") ||
      response.toLowerCase().includes("vamos a sacarte de las malas hierbas") ||
      response.toLowerCase().includes("sacarte de las malas hierbas");

    // If complete, mark session completed so the link can't be reused indefinitely
    if (isComplete) {
      const { error: completeError } = await supabaseAdmin
        .from("sessions")
        .update({
          status: "completed",
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (completeError) {
        console.error("Error marking session complete:", completeError);
        // Don't fail the request; the UI can still proceed.
      }
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the response in chunks
        const chunks = response.split(" ");
        let index = 0;

        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk =
              chunks[index] + (index < chunks.length - 1 ? " " : "");
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            );
            index++;
            setTimeout(sendChunk, 50); // 50ms delay between chunks
          } else {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ isComplete, protocolData: isComplete ? {} : null })}\n\n`
              )
            );
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
