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
      title: "WYDAHO WARRIOR KNIFE CHECK ASSESSMENT — CHEF OWNER REALITY CHECK",
      client_name: "Maksym",
      assessment_date: "January 2025",
      kitchen_term: "Burnt — running on fumes, keeping things going, but with nothing left in reserve",
      pattern_analysis: {
        pattern_exact_words:
          "I keep taking on more than I can handle, saying yes out of responsibility, and never creating space to step back or reset",
        pattern_reframe:
          "What I'm hearing: You've built your identity around being the one who holds everything together. Being needed has become your oxygen—but it's also suffocating you. You can't step back because stepping back means risking irrelevance, and irrelevance means facing the question you've been avoiding: who are you without the grind?",
        pattern_trigger:
          "This pattern shows up most when you sense someone needs you or when saying no would mean disappointing someone. The weight of responsibility hits before the first ticket even drops—your body knows you're about to sacrifice yourself again before your mind even processes it.",
        what_it_protects_from:
          "Facing who you are without the kitchen defining you and whether you're still enough if you slow down or step back",
        what_it_costs:
          "If you stay exactly where you are for another year, you'll lose the last remaining spark of joy you found in that quiet prep moment. You'll cement the belief that your only value is in how much you can sacrifice. You'll teach your nervous system that survival mode is permanent. And you'll drift further from the person who actually chose this work freely—until you can't remember him at all.",
        proof_with_context:
          "That quiet prep moment when you were cooking for people you cared about—no rush, no tickets, just presence. That wasn't a fluke, Maksym. That was you remembering what it feels like to cook from intention instead of obligation. The environment was right, the pressure was off, and you felt something you haven't felt in months: permission to just be. That version of you still exists.",
        anchor_habit: "Showing up early and pushing yourself to be fully ready, even when you're completely drained",
        personalized_chef_truth:
          "Brother, you've become so good at being needed that you've forgotten how to exist without the weight. Your body is bracing for a fight before service even starts because it knows what's coming—another round of sacrificing yourself to prove you matter. But here's the truth: you were enough before you became 'chef.' Your worth was settled in Christ before you ever picked up a knife. The pattern of taking on more than you can handle isn't strength—it's fear dressed up as responsibility. And until you face who you are without the kitchen defining you, you'll stay burnt.",
      },
      roadmap_briefs: {
        identity_brief:
          "Your identity has been swallowed by your role—you're 'chef' before you're Maksym. This pattern of being needed protects you from facing whether you're still enough if you slow down, but it's costing you your soul.",
        craft_brief:
          "You still have capacity for joy in your craft—that quiet prep moment proved it. But right now, craft has been replaced by survival. You're cooking from obligation, not intention.",
        purpose_brief:
          "Being a chef stopped feeling like calling when responsibility replaced curiosity. You've lost the sense of choosing this work freely—now it feels like a trap you can't escape without losing yourself.",
        environment_brief:
          "Your environment demands sacrifice as proof of value. The kitchen has become a place where you brace for a fight instead of creating beauty. Your nervous system is screaming before you even walk through the door.",
        missing_brief:
          "You revealed the core question haunting you: 'Who am I without the kitchen defining me?' That uncertainty feels heavier than another long service. The answer matters more than you think.",
        seventy_two_brief:
          "One 10-minute boundary practice sized to your current burnt state—a way to reclaim space without dismantling everything you've built.",
        thirty_day_brief:
          "A sustained nervous system reset combined with identity work that teaches your body it's safe to exist without the grind—before another year passes.",
      },
      domain_breakdown: {
        identity: {
          current_state:
            "Victim: Your role has consumed your personhood. You're 'chef' before you're Maksym. Your identity is so fused with what you do that imagining life without cooking professionally leaves you with no sense of self. You introduce yourself by function, not by name.",
          block: "Fear that without the grind, you're not enough. Being needed has become your proof of existence. Letting go of control means risking irrelevance—and irrelevance means facing the terrifying question: who are you when you're not performing?",
          growth_edge:
            "When you separate your worth from your performance, you'll discover that you exist before you produce. You'll learn to introduce yourself as Maksym who happens to cook, not as 'chef' who happens to have a name. You'll find permission to be human instead of functional.",
        },
        craft: {
          current_state:
            "Survival Mode: You're keeping the line moving but there's nothing left in reserve. Craft has been replaced by obligation—you're cooking to survive, not to create. That quiet prep moment where you felt joy is a distant memory buried under tickets and pressure.",
          block: "You've lost the sense of choosing this work freely. Responsibility and pressure have replaced curiosity and joy. You're so burnt that the idea of cooking from intention feels impossible—there's no space to even consider it.",
          growth_edge:
            "Reconnecting with craft means rediscovering what it feels like to cook without the weight of proving your worth. When you create space to step back, you'll remember why you picked up a knife in the first place. Joy isn't gone—it's just buried under survival.",
        },
        purpose: {
          current_state:
            "Lost: Being a chef stopped feeling like calling when responsibility replaced curiosity. You've drifted so far from the version of you who chose this work freely that you can't remember what that felt like. Purpose has been replaced by pressure.",
          block: "You're so deep in survival mode that purpose feels like a luxury you can't afford. The question 'why am I doing this?' is too scary to ask because you're not sure you have an answer anymore—and if you don't, what does that mean about the years you've invested?",
          growth_edge:
            "When you regulate your nervous system and reclaim your identity, purpose will emerge naturally. You'll rediscover that cooking for people you care about—with presence, not pressure—is where your calling still lives. Purpose isn't lost; it's just waiting for you to slow down enough to hear it.",
        },
        environment: {
          current_state:
            "Trapped: Your environment demands sacrifice as proof of value. Your chest tightens, your jaw clenches, and you mentally brace like you're heading into a fight before service even starts. Your nervous system knows what's coming—another round of war, not work.",
          block: "You can't create space to step back or reset because your environment reinforces the belief that stopping means failing. The kitchen has become a place where your worth is measured by how much you can handle—and you're drowning in that measurement.",
          growth_edge:
            "When you establish boundaries and shift your environment to support intention instead of obligation, your body will stop bracing for a fight. You'll create space where presence is possible—where you can cook without sacrificing yourself on the altar of responsibility.",
        },
      },
      kitchen_energy_assessment: {
        primary_state:
          "Burnt and Running on Fumes: You're keeping things going, but with nothing left in reserve. Your body is in full defense mode before service even starts—chest tight, jaw clenched, bracing for a fight instead of a shift. You're functioning, but your nervous system is screaming. This isn't fatigue sleep can fix—this is survival response that's become your baseline.",
        regulation_capacity:
          "Severely Depleted: You're so deep in the weeds that your body stays locked in fight mode even when there's no immediate threat. The dread and pressure hit before anything even starts. You numb with work, screens, and noise because sitting still means facing what you've been avoiding. You've lost access to rest—your nervous system doesn't remember what safety feels like.",
        observable_patterns: [
          "Chest tightens and jaw clenches before service even begins—full defensive posture",
          "Heavy sense of dread mixed with pressure hits immediately when thinking about work",
          "Burying yourself in work, screens, or noise to avoid sitting alone with your thoughts",
        ],
        energy_reality:
          "Maksym, your nervous system is stuck in permanent survival mode. Your body knows what's coming before your mind even processes it—another round of sacrifice, another service where you fight instead of create. You're not just tired; you're physiologically burnt. The pattern of taking on more than you can handle has taught your body that rest isn't safe. Until you regulate your nervous system and teach it that you can exist without the grind, every attempt at change will feel like forcing yourself through another service you don't have the energy for.",
      },
      missing_question_summary:
        "Maksym, you revealed the core question haunting you: 'Who am I without the kitchen defining me?' That uncertainty feels heavier than another long service—and that tells me everything. You've built your entire sense of self on being 'chef,' on being the one who holds everything together. The fear isn't just about losing the work—it's about losing yourself. But brother, here's the pastoral truth: you existed before you became 'chef.' Your worth was established in Christ before you ever picked up a knife. The kitchen didn't create you—it revealed something that was already there. The question isn't 'who are you without cooking?'—it's 'who is the Maksym God created underneath all the performance?' That's the question worth asking. And it's terrifying because the answer requires you to let go of control and trust that you're still enough when you're not grinding. But that's also where freedom lives.",
      thirty_day_protocol: {
        urgency_statement:
          "If you stay burnt for another month, you'll cement the belief that your only value is in sacrifice. You'll lose more ground with your nervous system. That quiet prep moment where you felt joy? It'll become a memory you can't access anymore. And the version of you who chose this work freely will drift so far away you won't recognize him. The cost isn't theoretical—it's your soul.",
        anchor_habit: "Showing up early and pushing yourself to be fully ready, even when you're completely drained",
        specific_action: "10-minute boundary practice before you leave for the kitchen",
        time_reps: "10 minutes, every morning before leaving for work",
        why_this_works:
          "You're already disciplined about showing up early—now we're redirecting that capacity toward regulating your nervous system instead of just surviving. This practice interrupts the pattern before the dread and pressure hit, teaching your body it's safe to exist without bracing for a fight.",
        book_recommendation: {
          title: "Set Boundaries, Find Peace",
          author: "Nedra Glover Tawwab",
          why_now:
            "Maksym, this book explains exactly why you keep taking on more than you can handle and saying yes out of responsibility. Tawwab breaks down how people-pleasing and over-functioning destroy you—and how to establish boundaries without guilt. Your pattern isn't about work ethic; it's about believing your worth depends on being needed. This book will show you how to set boundaries that protect your energy while still honoring your responsibilities—because right now, you're sacrificing yourself to prove you matter, and that's not sustainable.",
          asin: "0593192095",
        },
        immediate_practice:
          "Morning boundary meditation: Before leaving for the kitchen, sit for 10 minutes and practice saying 'no' to imaginary requests. Let your body feel what it's like to decline without guilt.",
        week_1_focus: "Foundation: Teaching Your Nervous System It's Safe to Exist Without the Grind",
        week_1_chapters: "Chapters 1-3: What Are Boundaries?, The Cost of Not Having Boundaries, Boundary Myths",
        week_1_practice:
          "Morning boundary meditation (10 minutes before leaving for kitchen): Sit quietly and practice saying 'no' to imaginary requests. Notice where your body tightens. Breathe into that space. Read 15 minutes from the book.",
        week_1_marker:
          "You'll notice the dread and pressure before work softening slightly. Your chest won't tighten as aggressively. You'll catch yourself saying 'yes' automatically and pause—even if you still say yes.",
        week_2_focus: "Pattern Recognition: Identifying Where You Over-Function",
        week_2_chapters: "Chapters 4-6: Types of Boundaries, Recognizing Boundary Issues, The People-Pleasing Trap",
        week_2_practice:
          "Continue morning boundary meditation. Add: Journal for 5 minutes after work—list every time you said 'yes' when you wanted to say 'no' and what you were protecting yourself from by saying yes. Read 15 minutes from the book.",
        week_2_marker:
          "You'll start seeing the pattern clearly: every 'yes' is protecting you from feeling like you're not enough. You'll catch yourself bracing for disappointment when you consider saying 'no.' You'll name the fear out loud at least once.",
        week_3_focus: "Implementation: Setting One Real Boundary",
        week_3_chapters: "Chapters 7-9: Setting Boundaries Without Guilt, How to Communicate Boundaries, Dealing With Pushback",
        week_3_practice:
          "Continue morning meditation. Choose ONE boundary to set this week—something small but real. Practice the script from the book. Say it out loud to yourself before saying it to the person. Read 15 minutes from the book.",
        week_3_marker:
          "You'll set one boundary and survive. Your body will feel the discomfort but won't collapse. Someone might push back, but you'll hold the line. You'll realize saying 'no' didn't destroy the relationship or prove you're selfish.",
        week_4_focus: "Integration: Building a Sustainable Boundary Practice",
        week_4_practice:
          "Morning boundary meditation becomes non-negotiable. Set one boundary per week moving forward. Journal daily: 'Where did I over-function today? What was I protecting myself from?' Review your 30-day journey and name one specific change in how your body feels before work.",
        week_4_marker:
          "After 30 days, your chest won't tighten as aggressively before work. You'll have set at least four real boundaries. You'll catch yourself saying 'yes' automatically and pause more often. Most importantly, you'll start to believe that you can exist without being needed—and that's when everything changes.",
        daily_actions: [
          "Day 1: Morning boundary meditation (10 min). Read Chapter 1. Notice how your body feels when you imagine saying 'no.'",
          "Day 2: Morning boundary meditation. Read Chapter 1 continued. Write down one time this week you said 'yes' when you wanted to say 'no.'",
          "Day 3: Morning boundary meditation. Read Chapter 2. Practice saying 'I need to think about that' out loud five times.",
          "Day 4: Morning boundary meditation. Read Chapter 2 continued. Notice where you brace for disappointment when considering boundaries.",
          "Day 5: Morning boundary meditation. Read Chapter 3. List three fears that come up when you think about saying 'no.'",
          "Day 6: Morning boundary meditation. Read Chapter 3 continued. Breathe into the tightness in your chest for 5 minutes.",
          "Day 7: Rest day. Morning meditation only. Reflect on what you noticed this week about your 'yes' pattern.",
          "Day 8: Morning boundary meditation. Read Chapter 4. Identify one boundary you need in your kitchen life.",
          "Day 9: Morning boundary meditation. Read Chapter 4 continued. Journal: 'What am I protecting myself from by not setting boundaries?'",
          "Day 10: Morning boundary meditation. Read Chapter 5. Notice every time today you say 'yes' automatically.",
          "Day 11: Morning boundary meditation. Read Chapter 5 continued. Practice saying 'Let me get back to you' instead of automatic 'yes.'",
          "Day 12: Morning boundary meditation. Read Chapter 6. Write down: 'Who would I disappoint if I set real boundaries?'",
          "Day 13: Morning boundary meditation. Read Chapter 6 continued. Name the fear out loud: 'I'm afraid that if I say no, I won't be enough.'",
          "Day 14: Rest day. Morning meditation only. Notice if the dread before work has softened at all.",
          "Day 15: Morning boundary meditation. Read Chapter 7. Choose ONE small boundary to set this week.",
          "Day 16: Morning boundary meditation. Read Chapter 7 continued. Write out the exact words you'll use to set your boundary.",
          "Day 17: Morning boundary meditation. Read Chapter 8. Practice saying your boundary script out loud to yourself five times.",
          "Day 18: Morning boundary meditation. Read Chapter 8 continued. Set your chosen boundary today. Notice what your body does.",
          "Day 19: Morning boundary meditation. Read Chapter 9. Journal: 'What happened when I set that boundary? What did I feel?'",
          "Day 20: Morning boundary meditation. Read Chapter 9 continued. If someone pushed back, practice holding the line without defending.",
          "Day 21: Rest day. Morning meditation only. Celebrate: You set a boundary and survived. You're still enough.",
          "Day 22: Morning boundary meditation. Review Chapters 7-9. Identify a second boundary you need to set.",
          "Day 23: Morning boundary meditation. Finish any remaining chapters. Write your script for boundary #2.",
          "Day 24: Morning boundary meditation. Practice your second boundary script out loud. Notice where your body resists.",
          "Day 25: Morning boundary meditation. Set your second boundary today. Breathe through the discomfort.",
          "Day 26: Morning boundary meditation. Journal: 'What am I learning about my worth outside of being needed?'",
          "Day 27: Morning boundary meditation. Notice how your nervous system responds before work now versus Day 1.",
          "Day 28: Morning boundary meditation. Set a third boundary this week—something slightly bigger.",
          "Day 29: Morning boundary meditation. Journal: 'Who am I becoming as I practice boundaries?'",
          "Day 30: Morning boundary meditation. Review your 30-day journey. Name three specific changes in how you feel before work. Commit to one boundary per week moving forward.",
        ],
      },
      bottom_line_full: {
        paragraph_1:
          "Maksym, you've built your identity around being the one who holds everything together. Being needed became your oxygen—proof that you matter, evidence of your worth. But that pattern emerged from a terrifying question you've been avoiding: 'Am I still enough if I'm not grinding?' So you kept saying yes, kept taking on more, kept sacrificing yourself to stay relevant. The kitchen became the place where your worth was proven daily—until it became the place that's destroying you.",
        paragraph_2:
          "Staying burnt for another year means losing the last spark of joy you felt in that quiet prep moment. It means cementing the belief that your value is measured by how much you can sacrifice. It means teaching your nervous system that survival mode is permanent—that your chest will always tighten, your jaw will always clench, and dread will always hit before the first ticket drops. It means drifting further from the Maksym who chose this work freely until you can't remember him at all. Brother, that's not a life. That's slow suffocation dressed up as responsibility.",
        paragraph_3:
          "The choice ahead is simple but not easy: learn to exist without the grind defining you, or die inside while your body keeps showing up. This isn't about quitting the kitchen—it's about reclaiming your humanity inside it. You have to face the question you've been avoiding: 'Who am I without the kitchen defining me?' The answer is terrifying because it requires letting go of control and trusting that you're still enough when you're not performing. But Maksym, your worth was settled before you ever picked up a knife. Christ already declared you enough. The kitchen didn't create you—it just revealed what was already there. You don't have to earn your existence. You just have to remember it.",
        emphasis_statement:
          "**Your worth isn't earned on the line. It was settled before you ever tied your apron. Now you just have to believe it.**",
      },
      steve_story_note:
        "Maksym, I disappeared from the kitchen for 18 months because I hit the same wall you're facing now. I was burnt, running on fumes, saying yes to everyone while my soul screamed no. My nervous system was wrecked. I didn't know who I was without the grind. So I left—not because I gave up, but because I had to find myself again. I had to learn that my worth wasn't tied to my performance, that I could exist without being needed, that rest wasn't weakness. I'm back now, but I'm different. I cook from intention, not obligation. I set boundaries without guilt. I know who I am before I'm 'chef.' That's what this 30-day protocol is designed to give you—a way to reclaim yourself without having to disappear like I did. You don't have to burn all the way down to rebuild. But you do have to face the question I avoided for too long: who are you when you're not performing? The answer is worth finding, brother.",
      pull_quote:
        "I honestly don't know who I'd be without cooking, and that uncertainty feels heavier than another long service",
      development_reminders: [
        "Getting burnt is normal in kitchen culture — staying burnt is a choice",
        "Your kitchen energy is the foundation — regulate first, then rebuild",
        "Your patterns have wisdom — honor them while updating them",
        "You are not your station — your worth is settled in Christ, not your covers",
      ],
      next_steps: {
        six_month_date: "July 2025",
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
