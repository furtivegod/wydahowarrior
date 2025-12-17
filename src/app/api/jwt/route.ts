import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sessionId: string;
      email: string;
    };

    // Also return session status so the client can block reuse after completion
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("status, ended_at")
      .eq("id", decoded.sessionId)
      .single();

    if (sessionError) {
      console.error("Session lookup error:", sessionError);
      // If we can't verify session state, still allow token validation
      return NextResponse.json({
        valid: true,
        sessionId: decoded.sessionId,
        email: decoded.email,
        completed: false,
      });
    }

    const completed = session?.status === "completed";

    return NextResponse.json({
      valid: true,
      sessionId: decoded.sessionId,
      email: decoded.email,
      completed,
      endedAt: session?.ended_at ?? null,
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email } = await request.json();

    if (!sessionId || !email) {
      return NextResponse.json(
        { error: "SessionId and email required" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ sessionId, email }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("JWT generation error:", error);
    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
