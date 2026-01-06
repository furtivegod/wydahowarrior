import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendMagicLink } from "@/lib/email";
import { generateToken } from "@/lib/auth";
import { Language } from "@/lib/i18n";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, language } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!language || (language !== "en" && language !== "es")) {
      return NextResponse.json(
        { error: "Valid language (en or es) is required" },
        { status: 400 }
      );
    }

    // Get session and user data
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select(
        `
        id,
        user_id,
        users!inner(email, user_name)
      `
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error("Error fetching session:", sessionError);
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    interface UserData {
      email?: string;
      user_name?: string;
    }

    const users = sessionData.users as UserData;
    const email = users?.email;
    const userName = users?.user_name;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    // Extract first name from user_name or email
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

    // Generate JWT token for magic link
    const token = generateToken(sessionId, email);

    // Send magic link email
    try {
      await sendMagicLink(email, sessionId, firstName, language as Language);
      console.log("✅ Magic link email sent successfully to:", email);

      return NextResponse.json({
        success: true,
        message: "Magic link email sent successfully",
        email,
      });
    } catch (emailError) {
      console.error("Failed to send magic link email:", emailError);
      return NextResponse.json(
        {
          error: "Failed to send magic link email",
          details:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in send-magic-link API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
