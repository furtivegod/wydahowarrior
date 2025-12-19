import { NextRequest, NextResponse } from "next/server";
import { generatePDF, PlanData } from "@/lib/pdf";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing PDF generation with sample data...");
    console.log(
      "⚠️  WARNING: This route uses HARDCODED SAMPLE DATA - NOT REAL USER DATA"
    );

    // Check if PDFShift API key is available
    if (!process.env.PDFSHIFT_API_KEY) {
      console.error("❌ PDFSHIFT_API_KEY not configured");
      return NextResponse.json(
        {
          success: false,
          error: "PDFSHIFT_API_KEY not configured",
          message: "PDF generation service not configured",
        },
        { status: 500 }
      );
    }

    // ⚠️ FAKE SAMPLE DATA FOR TESTING ONLY - DO NOT USE IN PRODUCTION
    // This contains fabricated quotes and responses that don't belong to any real user
    const samplePlanData: PlanData = {
      title: "WW KNIFE CHECK ASSESSMENT — CHEF OWNER REALITY CHECK",
      client_name: "Maksym",
      assessment_date: "2025",
      kitchen_term: "in the weeds",
      pattern_analysis: {
        pattern_exact_words:
          "Saying yes when I should say no — taking on too much, even when I know it's too much.",
        pattern_reframe:
          "What I'm hearing: You override your own capacity to avoid disappointing others, then use work itself to numb the burnout that the overcommitment creates. You're trapped in a loop where work is both the wound and the bandage.",
        pattern_trigger:
          "This pattern shows up most when someone needs something from you and you can feel their expectation — the weight of letting them down feels heavier than the weight of saying yes, so you take on more even when your chest is already tight and your shoulders are already carrying too much.",
        what_it_protects_from:
          "Having to face that you're human — that you can't do it all, that you have limits, and that setting those limits might disappoint people. It protects you from feeling the guilt of not being enough and the fear that if you say no, people will see you as less than you need to be.",
        what_it_costs:
          "Staying burnt protects me from facing the fear of letting people down or confronting the guilt of not being able to do it all.",
        proof_with_context:
          "Your body already knows the truth — that tightness in your chest and heaviness in your shoulders before service even starts. That's not weakness, Maksym. That's your system trying to tell you something important. The fact that you can name it, that you're here doing this assessment, that you know the difference between duty and spark — that's proof you haven't lost yourself. You're just buried under everyone else's needs.",
        anchor_habit: "Diving into work when pressure builds",
        personalized_chef_truth:
          "You say yes to protect yourself from guilt, but staying overcommitted keeps you numb to your own limits. Your body is screaming the truth before your mind catches up — tightness in your chest, weight on your shoulders — because you've been running on duty instead of desire for too long. The pattern isn't about being weak; it's about believing your worth depends on never disappointing anyone. But your identity is already settled in Christ. You don't have to earn enough-ness by saying yes to everything. Saying no is not failure — it's honesty. And that honesty is the only path out of the weeds.",
      },
      roadmap_briefs: {
        identity_brief:
          "You believe your worth comes from never letting anyone down, so you override your limits to prove you're enough. That's costing you your peace, your body, and your fire.",
        craft_brief:
          "You're still showing up, still executing, but the spark is gone. Duty drives you now, not joy. Your craft has become a weight instead of a gift.",
        purpose_brief:
          "Your original 'why' has been buried under everyone else's needs. You're serving out of obligation, not calling, and it's numbing you from the inside out.",
        environment_brief:
          "Your kitchen has become a place where you survive, not thrive. The biggest obstacle is that you've built a system that requires you to stay burnt just to keep it running.",
        missing_brief:
          "You revealed that work is both your problem and your painkiller — you dive deeper into tasks to escape the pressure that the tasks themselves create. You're in a loop, and you know it.",
        seventy_two_brief:
          "In the next 72 hours, practice saying one small no — just one — and sit with the discomfort of disappointing someone. Notice what happens. Does the world actually fall apart?",
        thirty_day_brief:
          "For 30 days, establish a daily boundary practice tied to your body's signals. When your chest tightens or shoulders get heavy, pause and ask: 'What am I saying yes to that I should be saying no to?' Then act on it.",
      },
      domain_breakdown: {
        identity: {
          current_state:
            "Victim: You believe your worth depends on never disappointing anyone, so you stay overcommitted to prove you're enough.",
          block: "The fear that saying no makes you less than — that people will see you as inadequate if you honor your limits.",
          growth_edge:
            "When you ground your identity in Christ instead of performance, you can say no without guilt. Your worth is already settled. You don't have to earn it by burning yourself out.",
        },
        craft: {
          current_state:
            "Survival Mode: You're still executing, but the spark is gone. Duty keeps you moving, not desire.",
          block: "Work has become both the wound and the bandage. You use it to numb the burnout it creates, so you never get space to reconnect with why you started.",
          growth_edge:
            "When you stop using work to escape work, you create space to remember what you actually love about the craft. Joy returns when you're not just surviving service but choosing to be present in it.",
        },
        purpose: {
          current_state:
            "Lost: Your original 'why' has been buried under everyone else's expectations. You're serving out of obligation, not calling.",
          block: "You can't reconnect with purpose while you're running on fumes. Numbness is the enemy of meaning.",
          growth_edge:
            "When you start honoring your limits, you create space to ask the big questions again: Why did I start this? What do I actually want? Who do I want to serve? Purpose emerges when you stop drowning.",
        },
        environment: {
          current_state:
            "Trapped: Your kitchen has become a place you survive, not a place you thrive. The system requires you to stay burnt just to keep it running.",
          block: "You've built a kitchen culture that rewards overcommitment and punishes boundaries. The environment itself reinforces the pattern.",
          growth_edge:
            "When you start modeling boundaries, you give everyone else permission to do the same. A sustainable kitchen starts with a chef who refuses to stay burnt. You change the culture by changing yourself first.",
        },
      },
      kitchen_energy_assessment: {
        primary_state:
          "In the Weeds: You're running on stress and obligation, still productive but exhausted. Your body is tight — chest compressed, shoulders heavy — and you have to remind yourself to breathe. The spark isn't there, just the grind.",
        regulation_capacity:
          "Developing but Overridden: You can feel your body's signals — the tightness, the heaviness — but you override them to keep moving. You push through instead of pausing, which means your nervous system is constantly running hot with no relief valve.",
        observable_patterns: [
          "Tightness in my chest and a heaviness in my shoulders — like my body knows what's coming before my mind does",
          "A mix of duty and numbness — I know I've got to show up, but the spark isn't always there right now",
          "When the pressure gets too heavy, I usually reach for work — diving deeper into tasks to escape the feeling",
        ],
        energy_reality:
          "Maksym, your body is ahead of your mind — it's signaling overload before you even clock in. That tightness in your chest and weight on your shoulders is your nervous system saying 'we've been running too hot for too long.' You're still executing, but you're doing it on fumes, not fire. The numbness is protection, but it's also a warning. You can't regulate what you refuse to feel, and right now, you're using work to avoid feeling how burnt you actually are. Change requires slowing down enough to hear what your body is trying to tell you.",
      },
      missing_question_summary:
        "Maksym revealed that work itself has become his escape mechanism — when the pressure builds, he dives deeper into tasks to avoid the feeling. This creates a devastating loop: the very thing burning him out is also the thing he uses to numb the burn. It's a grease fire he's trying to put out with more grease. This pattern keeps him stuck because he never gets space to actually process the pressure or address the root issue — his inability to say no. Until he breaks this loop, he'll stay buried under everyone else's needs while using work to avoid facing his own.",
      thirty_day_protocol: {
        urgency_statement:
          "If you stay in this loop for another month — saying yes to everything, using work to numb the burnout that the yeses create, never honoring the signals your body is screaming — you'll lose more than your spark. You'll lose your capacity to feel anything at all. The numbness will deepen, the tightness will become chronic, and the gap between who you are and who you're pretending to be will get so wide you won't recognize yourself anymore.",
        anchor_habit: "Diving into work when pressure builds",
        specific_action:
          "When you feel the urge to dive into work to escape pressure, pause for 60 seconds. Put your hand on your chest where you feel the tightness. Take three deep breaths. Then ask out loud: 'What am I avoiding right now?' Write down the first answer that comes. Don't fix it, don't dive back into work — just name it.",
        time_reps:
          "60 seconds, 3 deep breaths, 1 written answer — once per day minimum, ideally when the pressure hits",
        why_this_works:
          "This interrupts your pattern at the moment of activation. Instead of using work to numb, you're training yourself to pause and feel. That 60 seconds creates space between stimulus and response — the space where change happens. Your body already knows what you're avoiding; this practice lets your mind catch up.",
        book_recommendation: {
          title: "Set Boundaries, Find Peace",
          author: "Nedra Glover Tawwab",
          why_now:
            "Maksym, this book is written for you. Your entire pattern is about saying yes when you should say no because you're terrified of disappointing people. Tawwab breaks down why boundary-setting feels so hard, what it costs you to avoid it, and how to actually do it without guilt destroying you. She addresses exactly what you're facing: the belief that your worth depends on never letting anyone down. This book will show you that boundaries aren't selfish — they're the only way to sustain yourself and actually serve people well. You need this now because you're using work to avoid the very conversations that would set you free.",
          asin: "0593192095",
        },
        immediate_practice:
          "From the book: Practice the 'pause and assess' before every yes. When someone asks something of you, instead of auto-responding, pause for 10 seconds and ask yourself: 'Do I have the capacity for this right now, or am I saying yes to avoid disappointing them?' Then respond honestly.",
        week_1_focus: "Foundation: Understanding Your Boundary Blocks",
        week_1_chapters:
          "Introduction + Chapters 1-3: What boundaries are, why they matter, and what happens when you don't have them",
        week_1_practice:
          "Every day, when pressure builds and you want to dive into work, pause for 60 seconds. Hand on chest, three breaths, ask 'What am I avoiding?' Write it down. Do this at least once daily.",
        week_1_marker:
          "You'll know it's working when you can name what you're avoiding without immediately diving back into work to escape it. The awareness is the first win.",
        week_2_focus: "Pattern Recognition: Identifying Your Yes-to-Everything Triggers",
        week_2_chapters:
          "Chapters 4-6: Understanding boundary violations, people-pleasing patterns, and the cost of over-functioning",
        week_2_practice:
          "Continue the 60-second pause daily. Add this: Before saying yes to any request, pause for 10 seconds and ask 'Do I have capacity for this, or am I saying yes to avoid guilt?' You don't have to say no yet — just practice the pause and the honest assessment.",
        week_2_marker:
          "You'll notice the pattern clearly now — you can feel the moment when you're about to override your limits. Even if you still say yes sometimes, you're aware of it happening. That's progress.",
        week_3_focus: "Implementation: Practicing Small Nos",
        week_3_chapters:
          "Chapters 7-9: How to set boundaries without guilt, scripting difficult conversations, handling pushback",
        week_3_practice:
          "This week, say one small no each day. Something low-stakes. 'I can't take that shift.' 'I need to pass on this project.' 'Not this time.' Use Tawwab's scripts if you need them. Then sit with the discomfort for 5 minutes without diving into work. Just feel it.",
        week_3_marker:
          "You'll say at least one no without the world ending. You'll see that people can handle your boundaries better than you thought. And you'll notice your chest feels a little lighter when you're honest about your limits.",
        week_4_focus: "Integration: Building Sustainable Boundary Habits",
        week_4_practice:
          "Combine all three weeks: Daily 60-second pause when pressure hits. 10-second assessment before every yes. One intentional no per day. Plus, add a weekly review: What did I say yes to this week that I shouldn't have? What boundary do I need to set next week?",
        week_4_marker:
          "30-day outcome: You've said no at least 7 times without catastrophe. Your body's signals (chest tightness, shoulder weight) are starting to ease because you're honoring them instead of overriding them. You can feel the difference between duty and desire again — because you're not buried under everyone else's needs anymore. The spark isn't fully back yet, but you can see where it might return.",
        daily_actions: [
          "Day 1: Pause for 60 seconds when you feel chest tightness. Hand on chest, three breaths, ask 'What am I avoiding?' Write it down.",
          "Day 2: Before saying yes to any request today, pause 10 seconds and ask 'Do I have capacity, or am I saying yes to avoid guilt?'",
          "Day 3: Practice the 60-second pause again. Notice what comes up when you stop and feel instead of diving into work.",
          "Day 4: Read Chapter 1 of Set Boundaries, Find Peace. Notice which examples resonate with your pattern.",
          "Day 5: Say one small no today. Something low-stakes. 'I can't take that shift' or 'Not this time.'",
          "Day 6: Continue the daily pause. Add this: After each pause, ask 'What boundary do I need to set here?'",
          "Day 7: Review the week. What did you say yes to that you shouldn't have? What boundary do you need next week?",
          "Day 8: Read Chapters 2-3. Pay attention to the cost of not having boundaries in your kitchen life.",
          "Day 9: Practice the pause before every yes today. Even if you still say yes, practice the pause first.",
          "Day 10: Say another small no. Notice the discomfort. Sit with it for 5 minutes without diving into work.",
          "Day 11: Continue daily pause. Today, focus on noticing when your body signals overload before your mind catches up.",
          "Day 12: Read Chapters 4-6. Understand how people-pleasing patterns show up in your kitchen.",
          "Day 13: Before service, do the 60-second pause. Set an intention: 'I will honor my limits today.'",
          "Day 14: Say one no that feels slightly harder than before. Use Tawwab's scripts if you need them.",
          "Day 15: Mid-month check-in. How many times have you paused? How many nos have you said? What's shifting?",
          "Day 16: Read Chapters 7-9. Learn the scripts for setting boundaries without guilt.",
          "Day 17: Practice one boundary script today, even if it's just in your head. Rehearse it.",
          "Day 18: Say a no that requires a brief explanation. 'I can't because I'm honoring my capacity today.'",
          "Day 19: Continue daily pause. Today, notice how your chest feels lighter when you honor your limits.",
          "Day 20: Review the book sections that hit hardest. What's the one boundary you need to set this week?",
          "Day 21: Set that boundary. Use the scripts. Notice what happens. Does the world fall apart?",
          "Day 22: Continue daily pause. Add weekly review: What boundaries did I set? What do I need next?",
          "Day 23: Say another intentional no. Notice you're getting more comfortable with the discomfort.",
          "Day 24: Practice combining all three: Daily pause, 10-second assessment before yeses, intentional nos.",
          "Day 25: Review key book sections. What's the one truth about boundaries that changes everything for you?",
          "Day 26: Set a boundary that feels important. Not urgent, but important for your sustainability.",
          "Day 27: Continue the full practice. Notice your body's signals are starting to ease. Why?",
          "Day 28: Weekly review: What did I say yes to that I shouldn't have? What boundary do I need next week?",
          "Day 29: Practice the full protocol. Daily pause. Assessment before yeses. Intentional nos. Notice the shift.",
          "Day 30: 30-day outcome check. You've said no at least 7 times. Your body signals are easing. The spark is returning. What's next?",
        ],
      },
      bottom_line_full: {
        paragraph_1:
          "Maksym, the pattern is clear: you say yes when you should say no because you're terrified that setting boundaries makes you less than. You override your limits to avoid the guilt of disappointing people, and then you use work itself to numb the burnout that the overcommitment creates. It's a devastating loop — the very thing crushing you is also the thing you reach for to escape the crush. Your body knows this isn't sustainable. That tightness in your chest and heaviness in your shoulders before service even starts? That's your nervous system trying to protect you by signaling overload. But you override it every time because you believe your worth depends on never letting anyone down.",
        paragraph_2:
          "Here's what this is costing you: you're trading your soul for other people's comfort. You're accepting long-term suffering to avoid short-term guilt. The spark is gone because you're running on duty, not desire. Numbness is setting in because your body can't sustain this pace, so it's shutting down to protect you. If you stay in this loop for another year, you won't just lose your fire — you'll lose your capacity to feel anything at all. The gap between who you are and who you're pretending to be will get so wide you won't recognize yourself. And the hardest part? You already know this. You named it yourself: 'Staying burnt protects me from facing the fear of letting people down or confronting the guilt of not being able to do it all.' But that protection is killing you.",
        paragraph_3:
          "Here's the choice: you can keep running this pattern until your body forces you to stop, or you can start honoring your limits now — before the collapse. Transformation doesn't require a total life overhaul. It requires one thing: breaking the loop. Pause before you say yes. Sit with the discomfort of saying no. Let people be disappointed without diving into work to escape the feeling. Your worth is already settled in Christ — you don't have to earn it by burning yourself out. Saying no is not failure. It's honesty. And that honesty is the only way out of the weeds. The next 30 days will show you whether you're serious about change or just serious about staying comfortable in your suffering.",
        emphasis_statement:
          "You are not your output. Your identity is settled in Christ. You don't have to earn enough-ness by saying yes to everything. The world will not fall apart when you honor your limits — but you will if you don't.",
      },
      steve_story_note:
        "Maksym, I disappeared from the kitchen world for two years because I stayed in the exact loop you're in now. I said yes to everything, used work to numb the burnout, and told myself I was fine until my body shut me down completely. I lost my fire, my health, and almost lost myself. I'm back now because I learned the hard way that you can't serve anyone well when you're running on empty. Your body is trying to save you before you hit that wall. Listen to it.",
      pull_quote:
        "Tightness in my chest and a heaviness in my shoulders — like my body knows what's coming before my mind does.",
      development_reminders: [
        "Getting burnt is normal in kitchen culture — staying burnt is a choice",
        "Your kitchen energy is the foundation — regulate first, then rebuild",
        "Your patterns have wisdom — honor them while updating them",
        "You are not your station — your worth is settled in Christ, not your covers",
      ],
      next_steps: {
        six_month_date: "June 2025",
        community_link: "https://wydahowarriors.com/community",
        coaching_link: "https://wydahowarriors.com/coaching",
        contact_email: "steve@wydahowarriors.com",
      },
    };

    // Generate PDF with sample data
    console.log("📝 Starting PDF generation...");
    const result = await generatePDF(samplePlanData, "test-session-123");

    console.log("✅ PDF generated successfully!");
    console.log("📄 PDF URL:", result.pdfUrl);

    return NextResponse.json({
      success: true,
      message:
        "Sample assessment PDF generated successfully! This test validates the complete PDF generation pipeline.",
      pdfUrl: result.pdfUrl,
      sessionId: "test-session-123",
      testType: "Sample Data Assessment",
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ PDF generation test failed:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "PDF generation test failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
