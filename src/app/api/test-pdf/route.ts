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
      client_name: "Steven",
      assessment_date: "2025",
      kitchen_term: "gone",
      pull_quote: "I will become fearless.",
      pattern_analysis: {
        pattern_exact_words: "x",
        pattern_reframe:
          "What I'm hearing is a pattern so close, so embedded, you can't name it yet—or naming it feels too raw. You said 'x' when I asked what pattern keeps showing up. That's the sound of something unspoken, something you've been protecting yourself from seeing clearly. The pattern is this: you stay in motion, stay burnt, stay grinding—because if you stop, you have to face yourself without the whites on.",
        pattern_trigger:
          "This pattern shows up most when you're forced to look at who Steven is outside of 'Chef'—when the service rush ends, when the restaurant sells, when someone asks who you are instead of what you do.",
        what_it_protects_from:
          "Having to face who you are when you're not producing, not performing, not proving your worth through the work—facing the parts of yourself that don't fit in a kitchen uniform.",
        what_it_costs:
          "You didn't explicitly say what it would cost to stay exactly where you are, but here's what I heard: staying burnt, staying hidden behind the grind, costs you the fearless version of yourself who could actually love cooking again. It costs you joy. It costs you Sue. It costs you the truth that you're God's child first—not Chef first.",
        proof_with_context:
          "Last June when you made that Peruvian food—it was a challenge, the good kind, the kind that pulled you in and reminded you why you started this. You weren't grinding. You were creating. That wasn't luck. That was you, Steven, showing up for the craft because it mattered—not because you had to prove anything.",
        anchor_habit: "6am wake up—no matter what, you're up. That discipline runs deeper than motivation. Your body knows that rhythm even when everything else is chaos.",
        personalized_chef_truth:
          "You sold your restaurant because you needed out—relief and grief in the same moment. You said 'gone,' but you're not gone. You're still here, still waking at 6am, still reaching for the pan because something in you needs to create. The pattern that kept you burnt was protection—protection from facing yourself without the title, without the grind. But since Sue showed up on the Oregon coast in September 2023, something shifted. You started knowing you're God's child first, Chef second. That reorder changes everything. The cost of staying hidden is the fearless version of you who could love this craft again—not as identity, but as gift.",
      },
      roadmap_briefs: {
        identity_brief:
          "Your identity got swallowed by the title—'Chef' came before 'Steven.' But since meeting Sue in September 2023, you're anchoring in 'child of God' first. The cost of reverting to 'Chef first' is losing the freedom Sue helped you find.",
        craft_brief:
          "The fire isn't out—you cooked the other day just because you wanted to. You'd miss service if it disappeared. You love mistakes because they help you grow. The craft still matters—it's just been buried under everything else.",
        purpose_brief:
          "Your purpose shifted when Sue entered your life. You went from performing to prove worth to creating from a settled identity. The question now is what you're cooking for—obligation or gift?",
        environment_brief:
          "You sold the restaurant—relief and grief. The environment that was destroying you is gone, but your body still questions what's next. The biggest obstacle is building a new environment that supports Steven, not just Chef.",
        missing_brief:
          "When I asked about the pattern, you said 'x'—too close to name, too raw to speak. That's where you really are: standing in the space between who you were and who you're becoming, knowing the old protection doesn't fit anymore but unsure what replaces it.",
        seventy_two_brief:
          "For 72 hours: Wake at 6am (your anchor), then spend 5 minutes before coffee asking God one question: 'Who am I when I'm not performing?' Write down whatever comes—no editing, no judgment.",
        thirty_day_brief:
          "The sustained practice: Every morning after your 6am wake, read one page from Hero on a Mission, then cook one thing—just for you or Sue—with zero pressure to perform. Let the craft be gift, not grind.",
      },
      domain_breakdown: {
        identity: {
          current_state:
            "Finding Self: 'Chef' came first, but now 'child of God' is becoming the foundation. Sue's presence in September 2023 marked the shift.",
          block: "The title 'Chef' still tries to define you—especially when you introduce yourself or think about what's next.",
          growth_edge:
            "When your identity is settled in Christ, the craft becomes a gift you steward, not a performance you survive. Steven gets to exist outside the whites.",
        },
        craft: {
          current_state:
            "Rediscovering: You still want to get better. You cooked the other day just because. You'd miss service if it was gone. The fire's still there.",
          block: "The craft got tied to obligation and identity for so long, you're relearning what it feels like to create without proving your worth.",
          growth_edge:
            "When craft reconnects to joy instead of survival, you remember why you started—and cooking becomes worship, not grind.",
        },
        purpose: {
          current_state:
            "Searching: You know you're not done with cooking, but you're figuring out what it's for now that identity is settled.",
          block: "Old purpose was tied to performance and proving worth. New purpose hasn't fully formed yet—it's emerging in moments like that Peruvian food in June.",
          growth_edge:
            "Purpose-driven work flows from settled identity. When you know you're God's child first, the 'why' behind your craft becomes clear—you cook because you're made to create, not because you're trying to earn worth.",
        },
        environment: {
          current_state:
            "Exploring Options: You sold the restaurant—the environment that was burning you out is gone. Now you're standing in the open space asking what's next.",
          block: "Your body questions itself when you think about what comes next. The old environment is gone, but you haven't built the new one yet.",
          growth_edge:
            "When environment aligns with your settled identity and Sue's presence in your life, you build a kitchen (literal or metaphorical) that sustains you instead of destroying you.",
        },
      },
      kitchen_energy_assessment: {
        primary_state:
          "Gone but Not Out: You said 'gone'—you sold the restaurant, the chapter closed. But you're still waking at 6am, still cooking the other day just because. You're in the liminal space between what was and what's next, and your body is asking questions your mind doesn't have answers for yet.",
        regulation_capacity:
          "Developing: You've got the 6am anchor—that discipline holds you. You reach for chocolate when you need to quiet the questioning. You love mistakes now instead of letting them wreck you. But when you think about what's next, your body questions itself—that's your nervous system saying it's not sure it's safe to rebuild yet.",
        observable_patterns: [
          "Body questions itself when thinking about the future—uncertainty lives somewhere physical",
          "Reaches for chocolate to quiet the questioning—gentle self-regulation",
          "6am wake no matter what—anchored rhythm that holds through chaos",
        ],
        energy_reality:
          "Steven, your kitchen energy is in transition. You've got the foundation—that 6am wake, the discipline that runs deeper than motivation. But your nervous system is still processing the sale, the identity shift, the grief and relief living in the same space. The good news: you're still reaching for the craft because you want to, not because you have to. That means the fire isn't out—it's just asking for a different kind of fuel. Regulate first with your anchor, then rebuild from there.",
      },
      missing_question_summary:
        "When I asked what pattern keeps showing up, Steven said 'x.' That's the sound of something so close, so embedded, he can't name it yet—or naming it feels too raw. Later, when asked who he'd have to become to love cooking again, he said, 'I will become fearless.' The missing piece is this: Steven's been protecting himself from himself—from the parts that don't fit in the whites, from the vulnerability of being seen without the grind. The 'x' is the unnamed fear that if he stops performing, stops proving, he'll have to face who Steven is when he's not 'Chef.' But since Sue showed up in September 2023, something's shifting. He's starting to know he's God's child first. That reorder is the key—it's what makes fearless possible.",
      thirty_day_protocol: {
        urgency_statement:
          "The cost of staying 'gone'—of staying in that liminal space without rebuilding—is losing the fearless version of yourself who could love this craft again. Every day you wait to anchor in your settled identity is another day the questioning takes over.",
        anchor_habit: "6am wake up",
        specific_action:
          "After your 6am wake, before coffee, spend 5 minutes asking God one question: 'Who am I when I'm not performing?' Write down whatever comes—no editing, no judgment.",
        time_reps: "5 minutes daily, immediately after waking",
        why_this_works:
          "Your pattern is staying in motion to avoid facing yourself. This practice interrupts that pattern right at your anchor—when your discipline is strongest. It retrains your nervous system to be still and listen before the day's noise starts.",
        book_recommendation: {
          title: "Hero on a Mission",
          author: "Donald Miller",
          why_now:
            "Steven, you said your identity got swallowed by 'Chef'—the title came before your name. But since meeting Sue in September 2023, you're starting to anchor in 'child of God' first. Hero on a Mission is about rewriting your life story from victim to hero—not through performance, but through clarity about who you are and what you're living for. Miller breaks down the identity trap you've been in: transforming your identity from your work instead of stewarding your work from your identity. This book will help you see the story you've been living (Chef first, burnt out, protecting yourself from yourself) and give you a framework to write a new one—where Steven, child of God, creates because he's made to, not because he's trying to prove worth.",
          asin: "B08T1XJJ9B",
        },
        immediate_practice:
          "After reading each day's section in Hero on a Mission, cook one small thing—just for you or Sue—with zero pressure to perform. A perfect omelet. A simple pasta. Let the craft be gift, not grind. Notice what it feels like to create from rest instead of obligation.",
        week_1_focus: "Foundation: Settled Identity",
        week_1_chapters: "Introduction + Chapter 1: The Victim, the Villain, the Hero, and the Guide",
        week_1_practice:
          "6am wake → 5 minutes with God ('Who am I when I'm not performing?') → Read one section → Cook one thing with no pressure",
        week_1_marker:
          "You'll know it's working when you start noticing the difference between cooking to prove worth and cooking because you're made to create.",
        week_2_focus: "Pattern Recognition: Seeing the Story You've Been Living",
        week_2_chapters: "Chapters 2-4: Becoming a Hero, Creating Your Life Plan, Defining Your Mission",
        week_2_practice:
          "Continue 6am anchor + God question + reading. Add: Journal one moment each day when 'Chef' tries to come before 'Steven.' What triggered it? What would change if you let Steven lead?",
        week_2_marker:
          "You'll notice the 'x' pattern getting clearer—the moments when you hide behind the grind instead of showing up as yourself.",
        week_3_focus: "Implementation: Writing the New Story",
        week_3_chapters: "Chapters 5-7: The Five Characteristics of a Hero, Choosing Your Actions, Building Your Team",
        week_3_practice:
          "Continue daily rhythm. Add: Share one meal with Sue where you talk about who you're becoming, not what you used to do. Let her reflect back what she sees.",
        week_3_marker:
          "You'll start feeling less questioning in your body when you think about what's next—because you're building the new story in real time.",
        week_4_focus: "Integration: Living From Settled Identity",
        week_4_practice:
          "Continue all three weeks' practices. Add: Write a one-page 'eulogy'—not for your death, but for the burnt-out version of Chef that you sold with the restaurant. Honor what it protected you from, then release it. You're Steven now, child of God, who creates because he's made to.",
        week_4_marker:
          "30-day outcome: You'll wake up knowing who you are before you think about what you do. The fearless version of yourself who loves cooking will start showing up—not because the fear is gone, but because your identity is settled.",
        daily_actions: [
          "Day 1: 6am wake → 5 minutes with God asking 'Who am I when I'm not performing?' → Read Hero Intro → Cook scrambled eggs for yourself, no pressure",
          "Day 2: 6am wake → God question → Read Chapter 1 on Victim/Hero → Cook one thing → Notice when you feel like a victim of circumstances vs. a hero writing your story",
          "Day 3: 6am wake → God question → Continue Chapter 1 → Cook one thing → Journal: 'When did Chef come before Steven today?'",
          "Day 4: 6am wake → God question → Read Chapter 2 on Becoming a Hero → Cook one thing → Identify one choice today where you acted like Steven, not Chef",
          "Day 5: 6am wake → God question → Continue Chapter 2 → Cook one thing → Share with Sue one thing you're learning about yourself",
          "Day 6: 6am wake → God question → Read Chapter 3 on Life Plan → Cook one thing → Write down: What does Steven want that Chef never had space for?",
          "Day 7: 6am wake → God question → Rest day from book, but cook something just for joy → Reflect on the week: What shifted?",
          "Day 8: 6am wake → God question → Read Chapter 4 on Mission → Cook one thing → Journal: What am I cooking for now that identity is settled?",
          "Day 9: 6am wake → God question → Continue Chapter 4 → Cook one thing → Notice when your body questions itself—breathe and remind yourself you're God's child first",
          "Day 10: 6am wake → God question → Finish Chapter 4 → Cook one thing → Identify one moment today when you hid behind the grind instead of showing up as Steven",
          "Day 11: 6am wake → God question → Read Chapter 5 on Hero Characteristics → Cook one thing → Pick one characteristic you want to grow in",
          "Day 12: 6am wake → God question → Continue Chapter 5 → Cook one thing → Practice that characteristic today in one small way",
          "Day 13: 6am wake → God question → Finish Chapter 5 → Cook one thing → Journal: How does the 'x' pattern show up when I'm stressed?",
          "Day 14: 6am wake → God question → Rest day from book, cook something complex that challenges you → Notice the joy in the challenge",
          "Day 15: 6am wake → God question → Read Chapter 6 on Choosing Actions → Cook one thing → Identify three actions this week that align with Steven, not Chef-performing",
          "Day 16: 6am wake → God question → Continue Chapter 6 → Cook one thing → Take the first aligned action",
          "Day 17: 6am wake → God question → Finish Chapter 6 → Cook one thing → Take the second aligned action",
          "Day 18: 6am wake → God question → Read Chapter 7 on Building Your Team → Cook one thing → Invite Sue into a conversation about who you're becoming",
          "Day 19: 6am wake → God question → Continue Chapter 7 → Cook one thing → Share one meal with Sue—talk about the future as Steven, not as Chef",
          "Day 20: 6am wake → God question → Finish Chapter 7 → Cook one thing → Journal: What does Sue see in me that I'm still learning to see?",
          "Day 21: 6am wake → God question → Rest day, cook something you loved making before the burnout → Notice what's different now",
          "Day 22: 6am wake → God question → Review Hero on a Mission highlights → Cook one thing → Start writing your 'eulogy' for the burnt-out Chef",
          "Day 23: 6am wake → God question → Continue eulogy → Cook one thing → Honor what that version of you protected you from",
          "Day 24: 6am wake → God question → Finish eulogy → Cook one thing → Release the old story—you're Steven now",
          "Day 25: 6am wake → God question → No book, just presence → Cook one thing → Ask God: What do You want me to create from this settled identity?",
          "Day 26: 6am wake → God question → Cook one thing → Practice fearlessness in one small way: say no to something that would pull you back into performing",
          "Day 27: 6am wake → God question → Cook one thing → Notice your body—is the questioning quieter? Write down what's shifted.",
          "Day 28: 6am wake → God question → Cook one thing → Share with Sue: Here's who I'm becoming. Here's what I'm building from here.",
          "Day 29: 6am wake → God question → Cook a full meal for Sue, from settled identity—not performing, just creating → Notice the joy",
          "Day 30: 6am wake → God question → Cook one thing → Write: Who is Steven now? What does he create? What does he protect? Where does he go from here?",
        ],
      },
      bottom_line_full: {
        paragraph_1:
          "Steven, the pattern is this: you stayed in motion, stayed burnt, stayed grinding—because if you stopped, you'd have to face yourself without the whites on. 'Chef' came before 'Steven' for so long that selling the restaurant felt like losing your name. You said 'x' when I asked what pattern keeps showing up—that's the sound of something so close, so embedded, you couldn't name it yet. The pattern was protection. It kept you from facing who you are when you're not performing, not producing, not proving your worth through the work.",
        paragraph_2:
          "But here's what it's costing you: staying hidden behind the grind costs you the fearless version of yourself who could actually love cooking again. It costs you joy. It costs you the truth that Sue helped you see—that you're God's child first, not Chef first. You met her in September 2023 on the Oregon coast, and something reordered. That reorder is everything. Because when your identity is settled in Christ, the craft becomes a gift you steward instead of a performance you survive.",
        paragraph_3:
          "The choice ahead is this: you can stay 'gone,' stay in that liminal space where your body questions itself and you reach for chocolate to quiet the noise—or you can rebuild from your 6am anchor, from your settled identity, from the truth that you're made to create. What's required is daily practice. Five minutes with God before the noise starts. One page of truth about who you are. One act of creation with zero pressure to perform. Thirty days to prove to your nervous system that Steven gets to exist outside the title. You said you'd miss service. You cooked the other day just because. The fire isn't out. It's just asking for a different kind of fuel.",
        emphasis_statement:
          "**You're not gone, Steven. You're becoming fearless. And that version of you? He doesn't need the restaurant to prove he's worth knowing. He already knows whose he is.**",
      },
      steve_story_note:
        "Steven, I disappeared from my own kitchen for a while—not because I wanted to, but because I had to. The grind, the performance, the hiding behind the whites—it nearly took me out. I'm building Wydaho Warriors because I know what it costs to stay burnt, and I know what it takes to come back. You're not alone in this. The path from 'gone' to 'becoming' is one I've walked, and it's one you don't have to walk alone.",
      development_reminders: [
        "Getting burnt is normal in kitchen culture—staying burnt is a choice",
        "Your kitchen energy is the foundation—regulate first, then rebuild",
        "Your patterns have wisdom—honor them while updating them",
        "You are not your station—your worth is settled in Christ, not your covers",
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
