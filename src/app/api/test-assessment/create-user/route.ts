import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and firstName are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Handle fetch errors (but continue if user just doesn't exist)
    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing user:", fetchError);
      return NextResponse.json(
        { error: "Failed to check for existing user", details: fetchError },
        { status: 500 }
      );
    }

    let userId;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new test user
      const { data: newUser, error: userError } = await supabaseAdmin
        .from("users")
        .insert({
          email,
          user_name: firstName,
        })
        .select("id")
        .single();

      if (userError) {
        console.error("Failed to create test user:", userError);
        return NextResponse.json(
          { error: "Failed to create test user", details: userError },
          { status: 500 }
        );
      }

      if (!newUser || !newUser.id) {
        console.error("User created but no ID returned:", newUser);
        return NextResponse.json(
          { error: "User created but no ID returned" },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Error in create-user route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

