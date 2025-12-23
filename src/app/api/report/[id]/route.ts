import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PlanData } from "@/lib/pdf";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const sessionId = params.id;

    console.log("Report viewer API called for session:", sessionId);

    // Try to get signed PDF URL first
    const signedPdfUrl = await getSignedPDFUrl(sessionId);
    console.log("PDF URL found:", signedPdfUrl ? "Yes" : "No");
    console.log("PDF URL:", signedPdfUrl);

    // Always show HTML page, don't redirect to PDF
    console.log("Generating HTML view for session:", sessionId);

    const { data: planOutput, error: planError } = await supabase
      .from("plan_outputs")
      .select("plan_json")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (planError || !planOutput) {
      console.error("Error fetching plan data:", planError);

      // If all else fails, show a fallback message
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Report Not Ready</title>
          <style>
            body { 
              font-family: 'Georgia', 'Times New Roman', serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #F5F1E8;
            }
            .container {
              text-align: center;
              max-width: 500px;
              padding: 2rem;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 1rem;
              background: #FFF3CD;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #D4AF37;
            }
            h1 { color: #3D4D2E; margin-bottom: 1rem; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; }
            p { color: #1A1A1A; line-height: 1.6; }
            .retry-btn {
              background: #7ED321;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 1rem;
              transition: opacity 0.2s;
            }
            .retry-btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⏳</div>
            <h1>Report Not Ready Yet</h1>
            <p>Your personalized protocol is still being generated. This usually takes just a few moments.</p>
            <p>Please check back in a minute or check your email for the completed report.</p>
            <button class="retry-btn" onclick="window.location.reload()">Refresh Page</button>
          </div>
        </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    const planData = planOutput.plan_json;

    // Get user data and session date to display the correct name and date
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id, started_at")
      .eq("id", sessionId)
      .single();

    let userName = "Client"; // Default fallback
    let sessionDate: Date | null = null;
    if (!sessionError && sessionData) {
      // Get session date
      if (sessionData.started_at) {
        sessionDate = new Date(sessionData.started_at);
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_name")
        .eq("id", sessionData.user_id)
        .single();

      if (!userError && userData?.user_name) {
        userName = userData.user_name;
      }
    }

    return generateHTMLReport(
      planData,
      sessionId,
      signedPdfUrl,
      userName,
      sessionDate
    );
  } catch (error) {
    console.error("Report viewer error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function getSignedPDFUrl(sessionId: string): Promise<string | null> {
  try {
    const { data: pdfJob, error } = await supabase
      .from("pdf_jobs")
      .select("pdf_url, status")
      .eq("session_id", sessionId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !pdfJob) {
      console.log("No completed PDF found for session:", sessionId);
      return null;
    }

    return pdfJob.pdf_url;
  } catch (error) {
    console.error("Error getting signed PDF URL:", error);
    return null;
  }
}

function generateHTMLReport(
  planData: PlanData,
  sessionId: string,
  signedPdfUrl?: string | null,
  userName?: string,
  sessionDate?: Date | null
) {
  const clientName = userName || "Client";

  // Get session date for accurate assessment date
  const assessmentDate = sessionDate
    ? sessionDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : planData.assessment_date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  const disclaimer =
    planData.disclaimer ||
    "This assessment is a tool for personal development and self-awareness. It is not a diagnostic tool and does not replace professional mental health support. If you are experiencing a mental health crisis, please contact a qualified professional or crisis support service.";

  // Extract data similar to PDF generation - NEW 9-PAGE FRAMEWORK
  const patternAnalysis = planData.pattern_analysis || {};
  const kitchenTerm = planData.kitchen_term || "burnt";
  const patternExactWords =
    patternAnalysis.pattern_exact_words ||
    patternAnalysis.protective_pattern ||
    "";
  const patternReframe = patternAnalysis.pattern_reframe || "";
  const patternTrigger = patternAnalysis.pattern_trigger || "";
  const whatItsProtectingFrom = patternAnalysis.what_it_protects_from || "";
  const whatItsCosting = patternAnalysis.what_it_costs || "";
  const proofWithContext =
    patternAnalysis.proof_with_context || patternAnalysis.success_proof || "";
  const anchorHabit =
    patternAnalysis.anchor_habit || patternAnalysis.anchor || "";
  const personalizedChefTruth = patternAnalysis.personalized_chef_truth || "";

  // Extract roadmap briefs
  const roadmapBriefs = planData.roadmap_briefs || {};
  const identityBrief = roadmapBriefs.identity_brief || "";
  const craftBrief = roadmapBriefs.craft_brief || "";
  const purposeBrief = roadmapBriefs.purpose_brief || "";
  const environmentBrief = roadmapBriefs.environment_brief || "";
  const missingBrief = roadmapBriefs.missing_brief || "";
  const seventyTwoBrief = roadmapBriefs.seventy_two_brief || "";
  const thirtyDayBrief = roadmapBriefs.thirty_day_brief || "";

  // Extract domain breakdown (NEW - identity, craft, purpose, environment)
  const domainBreakdown = planData.domain_breakdown || {};
  const identityDomain = domainBreakdown.identity || {};
  const craftDomain = domainBreakdown.craft || {};
  const purposeDomain = domainBreakdown.purpose || {};
  const environmentDomain = domainBreakdown.environment || {};

  // Extract kitchen energy assessment (NEW)
  const kitchenEnergy = planData.kitchen_energy_assessment || {};

  // Extract protocol data
  const thirtyDayProtocol = planData.thirty_day_protocol || {};
  const urgencyStatement = thirtyDayProtocol.urgency_statement || "";
  const protocolAnchorHabit = thirtyDayProtocol.anchor_habit || anchorHabit;
  const specificAction = thirtyDayProtocol.specific_action || "";
  const timeReps = thirtyDayProtocol.time_reps || "";
  const whyThisWorks = thirtyDayProtocol.why_this_works || "";
  const immediatePractice = thirtyDayProtocol.immediate_practice || "";
  const week1Focus = thirtyDayProtocol.week_1_focus || "";
  const week1Chapters = thirtyDayProtocol.week_1_chapters || "";
  const week1Practice = thirtyDayProtocol.week_1_practice || "";
  const week1Marker = thirtyDayProtocol.week_1_marker || "";
  const week2Focus = thirtyDayProtocol.week_2_focus || "";
  const week2Chapters = thirtyDayProtocol.week_2_chapters || "";
  const week2Practice = thirtyDayProtocol.week_2_practice || "";
  const week2Marker = thirtyDayProtocol.week_2_marker || "";
  const week3Focus = thirtyDayProtocol.week_3_focus || "";
  const week3Chapters = thirtyDayProtocol.week_3_chapters || "";
  const week3Practice = thirtyDayProtocol.week_3_practice || "";
  const week3Marker = thirtyDayProtocol.week_3_marker || "";
  const week4Focus = thirtyDayProtocol.week_4_focus || "";
  const week4Practice = thirtyDayProtocol.week_4_practice || "";
  const week4Marker = thirtyDayProtocol.week_4_marker || "";

  // Extract daily actions (30-day protocol)
  const dailyActions = Array.isArray(thirtyDayProtocol.daily_actions)
    ? thirtyDayProtocol.daily_actions
    : [];

  // Extract book recommendation (NEW - single book from protocol)
  const bookRec = thirtyDayProtocol.book_recommendation || {};
  const bookTitle = bookRec.title || "";
  const bookAuthor = bookRec.author || "";
  const bookWhyNow = bookRec.why_now || "";

  // Extract bottom line full (3 paragraphs + emphasis)
  const bottomLineFull = planData.bottom_line_full || {};
  const bottomLinePara1 = bottomLineFull.paragraph_1 || "";
  const bottomLinePara2 = bottomLineFull.paragraph_2 || "";
  const bottomLinePara3 = bottomLineFull.paragraph_3 || "";
  const bottomLineEmphasis = bottomLineFull.emphasis_statement || "";

  // Extract Steve's story
  const steveStoryNote = planData.steve_story_note || "";

  // Extract pull quote
  const pullQuote = planData.pull_quote || planData.reminder_quote || "";

  // Extract development reminders (NEW - 4 core reminders)
  const developmentReminders = Array.isArray(planData.development_reminders)
    ? planData.development_reminders
    : [
        "Getting burnt is normal in kitchen culture—staying burnt is a choice",
        "Your kitchen energy is the foundation—regulate first, then rebuild",
        "Your patterns have wisdom—honor them while updating them",
        "You are not your station—your worth is settled in Christ, not your covers",
      ];

  // Extract next steps
  const nextSteps = planData.next_steps || {};
  const sixMonthDate = nextSteps.six_month_date || "";
  const communityLink = nextSteps.community_link || "";
  const coachingLink = nextSteps.coaching_link || "";
  const contactEmail = nextSteps.contact_email || "steve@wydahowarriors.com";

  // Helper function to format text with paragraph breaks
  function formatTextWithParagraphBreaks(text: string | undefined): string {
    if (!text) return "";
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const paragraphSentences = sentences.slice(i, i + 2);
      paragraphs.push(paragraphSentences.join(" "));
    }
    return paragraphs.map((paragraph) => `<p>${paragraph.trim()}</p>`).join("");
  }

  // Chef-owner specific book list (9-PAGE FRAMEWORK) - matching PDF structure
  const chefOwnerBooks = [
    {
      id: "kitchen_confidential",
      title: "Kitchen Confidential",
      author: "Anthony Bourdain",
      asin: "0060899220",
      why: "Raw honesty about kitchen life, reconnects them to why they started",
      patterns: ["lost passion", "identity crisis", "why did I start"],
    },
    {
      id: "setting_the_table",
      title: "Setting the Table",
      author: "Danny Meyer",
      asin: "0060742763",
      why: "Meaning-driven hospitality, culture-building, enlightened hospitality model",
      patterns: ["people management", "staff chaos", "team building"],
    },
    {
      id: "find_your_why",
      title: "Find Your Why",
      author: "Simon Sinek",
      asin: "0143111728",
      why: "Clarifies original purpose, helps rebuild around meaning",
      patterns: ["purpose confusion", "why am I doing this", "lost meaning"],
    },
    {
      id: "body_keeps_score",
      title: "The Body Keeps the Score",
      author: "Bessel van der Kolk",
      asin: "0143127748",
      why: "Explains trauma responses, regulation capacity, somatic patterns",
      patterns: ["burnout", "exhaustion", "nervous system shutdown"],
    },
    {
      id: "hero_on_mission",
      title: "Hero on a Mission",
      author: "Donald Miller",
      asin: "0785232303",
      why: "Reframes identity from Victim/Villain to Hero/Guide, story work",
      patterns: ["identity equals chef", "can't separate self from work"],
    },
    {
      id: "designing_your_life",
      title: "Designing Your Life",
      author: "Bill Burnett & Dave Evans",
      asin: "1101875321",
      why: "Wayfinding for chef-owners exploring options outside current situation",
      patterns: ["considering major life change", "leaving industry"],
    },
    {
      id: "gifts_of_imperfection",
      title: "The Gifts of Imperfection",
      author: "Brené Brown",
      asin: "159285849X",
      why: "Shame resilience, letting go of 'suffer for your art' mythology",
      patterns: ["perfectionism", "mistakes spiral"],
    },
    {
      id: "set_boundaries",
      title: "Set Boundaries, Find Peace",
      author: "Nedra Tawwab",
      asin: "0593192095",
      why: "Boundary scripts, practice saying no without guilt",
      patterns: ["can't say no", "no boundaries"],
    },
    {
      id: "atomic_habits",
      title: "Atomic Habits",
      author: "James Clear",
      asin: "0735211299",
      why: "Identity-based behavior change, sustainable systems",
      patterns: ["substance issues", "numbing patterns"],
    },
    {
      id: "essentialism",
      title: "Essentialism",
      author: "Greg McKeown",
      asin: "0804137382",
      why: "Disciplined pursuit of less, saying no to good to say yes to great",
      patterns: ["general overwhelm", "in the weeds constantly"],
    },
  ];

  // Select book - use provided book from protocol, or select based on pattern (matching PDF logic)
  let selectedBook = null;
  if (bookTitle && bookAuthor) {
    // Use book from protocol
    selectedBook = {
      title: bookTitle,
      author: bookAuthor,
      why: bookWhyNow,
    };
  } else {
    // Select based on pattern analysis
    const patternText = (
      patternExactWords +
      " " +
      whatItsProtectingFrom +
      " " +
      personalizedChefTruth
    ).toLowerCase();
    const scored = chefOwnerBooks.map((book) => {
      const score = book.patterns.reduce(
        (acc: number, pattern: string) =>
          acc + (patternText.includes(pattern.toLowerCase()) ? 1 : 0),
        0
      );
      return { book, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.find((s) => s.score > 0);
    selectedBook = top
      ? {
          title: top.book.title,
          author: top.book.author,
          why: top.book.why,
        }
      : {
          title: "Kitchen Confidential",
          author: "Anthony Bourdain",
          why: "Raw honesty about kitchen life, reconnects you to why you started",
        };
  }

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wydaho Warrior Knife Check Assessment - ${clientName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --cream: #F5F3ED;
                --warm-white: #FFFFFF;
                --deep-charcoal: #1A1A1A;
                --soft-gold: #C9A875;
                --dark-olive: #3D4D2E;
                --lime-green: #7ED321;
            }

        body { 
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11pt;
                font-weight: 400;
                line-height: 1.8;
                color: var(--deep-charcoal);
                background: #f5f5f5;
                overflow-x: hidden;
            }

            .page {
                min-height: 100vh;
                padding: 40px 30px;
                background: var(--warm-white);
                margin-bottom: 2px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                position: relative;
            }

            .page-content {
                max-width: 650px;
                margin: 0 auto;
                width: 100%;
            }

            /* COVER PAGE */
            .cover {
                background: linear-gradient(180deg, var(--warm-white) 0%, var(--cream) 100%);
                text-align: center;
                position: relative;
            }

            .cover::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(201, 169, 110, 0.03) 1px, rgba(201, 169, 110, 0.03) 2px),
                    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(201, 169, 110, 0.03) 1px, rgba(201, 169, 110, 0.03) 2px);
                background-size: 60px 60px;
                opacity: 0.5;
            }

            .cover-content {
                position: relative;
                z-index: 1;
                text-align: center;
            }

            .logo-mark {
                font-size: 10px;
                letter-spacing: 0.3em;
                color: var(--soft-gold);
                margin-bottom: 80px;
                font-weight: 500;
            }

            h1 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 56px;
                font-weight: 700;
                color: var(--dark-olive);
                line-height: 1.1;
                letter-spacing: -0.02em;
                margin: 0 0 40px 0;
                text-align: center;
            }

            h2 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 32px;
                font-weight: 700;
                color: var(--dark-olive);
                line-height: 1.2;
                margin-bottom: 30px;
            }

            .client-name {
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.1em;
                color: #666;
                margin-bottom: 120px;
            }

            .cover-tagline {
                font-family: 'Inter', sans-serif;
                font-size: 20px;
                font-weight: 500;
                color: var(--deep-charcoal);
                margin-top: 80px;
                line-height: 1.6;
            }

            /* SECTION HEADERS */
            .section-header {
                margin-bottom: 50px;
                text-align: center;
            }

            .section-label {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: var(--soft-gold);
                margin-bottom: 30px;
            }

            .section-title {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                font-weight: 700;
                color: var(--dark-olive);
                letter-spacing: -0.01em;
                line-height: 1.2;
            }

            /* CONTENT BLOCKS */
            .content-block {
                margin: 60px 0;
            }

            .block-title {
                font-size: 10px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--soft-gold);
                font-weight: 500;
                margin-bottom: 20px;
            }

            .block-content {
                font-size: 13px;
                line-height: 2;
                font-weight: 400;
            }

            /* DOMAIN HERO */
            .domain-hero {
                font-size: 96px;
                font-weight: 700;
                color: var(--dark-olive);
                text-align: center;
                margin-bottom: 80px;
                letter-spacing: -0.03em;
                font-family: 'Playfair Display', serif;
            }

            /* METRICS */
            .metric-row {
                display: flex;
                justify-content: space-between;
                padding: 30px 0;
                border-bottom: 1px solid rgba(0,0,0,0.08);
            }

            .metric-row:first-of-type {
                border-top: 1px solid rgba(0,0,0,0.08);
            }

            .metric-label {
                font-size: 10px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--soft-gold);
                font-weight: 500;
            }

            .metric-value {
                font-family: 'Inter', sans-serif;
                font-size: 18px;
                font-weight: 500;
            }

            /* PULL QUOTE */
            .pull-quote {
                margin: 100px 0;
                padding: 60px 0;
                border-top: 1px solid rgba(201, 169, 110, 0.3);
                border-bottom: 1px solid rgba(201, 169, 110, 0.3);
          text-align: center;
            }

            .pull-quote-text {
                font-family: 'Inter', sans-serif;
                font-size: 28px;
                font-weight: 500;
                color: var(--dark-olive);
                line-height: 1.6;
                margin-bottom: 30px;
            }

            /* BOTTOM LINE */
            .bottom-line-page {
                background: var(--deep-charcoal);
                color: var(--warm-white);
            }

            .bottom-line-page h2 {
                color: var(--warm-white);
            }

            .bottom-line-page p {
                font-size: 15px;
                line-height: 2;
                color: rgba(255,255,255,0.85);
            }

            /* PAGE NUMBER */
            .page-number {
                position: absolute;
                bottom: 40px;
                right: 60px;
                font-size: 9px;
                letter-spacing: 0.1em;
                color: #999;
            }

            .divider {
                width: 60px;
                height: 1px;
                background: var(--soft-gold);
                margin: 80px auto;
            }

            /* V3.0 ROADMAP FLOW */
            .roadmap-flow {
                margin: 40px 0;
            }

            .roadmap-step {
                margin: 30px 0;
                padding-left: 40px;
                position: relative;
            }

            .roadmap-step::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: -30px;
                width: 2px;
                background: var(--soft-gold);
            }

            .roadmap-step:last-child::before {
                display: none;
            }

            .roadmap-letter {
                position: absolute;
                left: -15px;
                top: 0;
                width: 30px;
                height: 30px;
                background: var(--dark-olive);
                color: var(--warm-white);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Playfair Display', serif;
                font-size: 16px;
                font-weight: 700;
            }

            .roadmap-arrow {
                position: absolute;
                left: 2px;
                top: 30px;
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid var(--soft-gold);
            }

            .roadmap-label {
                font-size: 10px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--soft-gold);
                font-weight: 500;
                margin-bottom: 8px;
            }

            .roadmap-brief {
                font-size: 13px;
                line-height: 1.6;
                color: var(--deep-charcoal);
            }

            /* V3.0 DOMAIN GRID */
            .domain-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 70px;
                margin: 20px 0;
            }

            .domain-card {
                border: 1px solid rgba(201, 169, 110, 0.3);
                padding: 15px;
                background: var(--cream);
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }

            .domain-card-title {
                font-family: 'Playfair Display', serif;
                font-size: 18px;
                font-weight: 700;
                color: var(--dark-olive);
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid rgba(201, 169, 110, 0.3);
            }

            .domain-card-row {
                margin: 8px 0;
                padding: 6px 0;
                border-bottom: 1px solid rgba(201, 169, 110, 0.15);
            }

            .domain-card-row:last-child {
                border-bottom: none;
            }

            .domain-card-label {
                font-size: 8px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--soft-gold);
                font-weight: 500;
                margin-bottom: 4px;
            }

            .domain-card-value {
                font-size: 11px;
                line-height: 1.5;
                color: var(--deep-charcoal);
                font-weight: 400;
            }

            /* SABOTAGE PATTERN ANALYSIS */
            .sabotage-content {
                margin-top: 40px;
            }

            .sabotage-section {
                margin-bottom: 30px;
            }

            .sabotage-section:last-child {
                margin-bottom: 0;
            }

            .sabotage-text {
                font-size: 14px;
                line-height: 1.8;
                text-align: left;
            }

            p {
                margin-bottom: 28px;
                line-height: 1.9;
            }

            /* PROTOCOL */
            .protocol-item {
                margin: 50px 0;
                padding-bottom: 50px;
                border-bottom: 1px solid rgba(0,0,0,0.06);
            }

            .protocol-timeline {
                font-size: 10px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--soft-gold);
                font-weight: 500;
                margin-bottom: 15px;
            }

            .protocol-action {
                font-size: 15px;
                line-height: 1.8;
                font-weight: 300;
            }

            .protocol-goals {
                margin-top: 20px;
            }

            .goal-item {
                font-size: 13px;
                line-height: 1.8;
                font-weight: 300;
                margin: 8px 0;
                padding-left: 20px;
                position: relative;
            }

            .goal-item::before {
                content: '•';
                color: var(--soft-gold);
                font-weight: bold;
                position: absolute;
                left: 0;
            }

            /* REMINDERS */
            .reminder-item {
                padding: 25px 0;
                border-bottom: 1px solid rgba(0,0,0,0.06);
                font-size: 13px;
                line-height: 1.9;
                font-weight: 300;
            }

            /* PDF BUTTON */
        .pdf-button {
                background: var(--soft-gold);
                color: var(--deep-charcoal);
          border: none;
                padding: 15px 30px;
                border-radius: 0;
          cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin: 40px 0;
                transition: all 0.3s ease;
            }

            .pdf-button:hover { 
                background: var(--deep-charcoal);
                color: var(--warm-white);
            }

        .pdf-button:disabled { 
          background: #ccc; 
          cursor: not-allowed; 
        }

            @media (max-width: 768px) {
                .page {
                    padding: 60px 30px;
                }
                h1 {
                    font-size: 48px;
                }
                .domain-hero {
                    font-size: 56px;
                }
        }
      </style>
    </head>
    <body>

        <!-- PAGE 1: COVER -->
        <div class="page cover">
            <div class="cover-content">
                <h1>ARE YOU BURNT?<br>CHEF OWNER<br>REALITY CHECK</h1>
                <div class="client-name">${clientName}</div>
                <div style="font-size: 18px; font-weight: 500; color: var(--deep-charcoal); margin-top: 60px; font-style: italic; font-family: 'Playfair Display', serif;">Every second counts, chef.</div>
                <div style="font-size: 12px; color: #666; margin-top: 10px;">— Steve Murphy</div>
                <div style="font-size: 10px; color: #999; margin-top: 80px; letter-spacing: 0.1em;">Culinary Institute of America</div>
                <div style="font-size: 10px; color: #999; letter-spacing: 0.1em;">Wydaho Warriors LLC</div>
            </div>
        </div>

        <!-- PAGE 2: YOUR CURRENT STATE -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">Where You Are Right Now</div>
                    <div class="section-title">Your Current State</div>
                </div>
                
                <div class="sabotage-content">
                    <div class="sabotage-section">
                        <div class="block-title">YOUR KITCHEN TERM</div>
                        <div class="sabotage-text">You described your life as: <strong>${kitchenTerm}</strong></div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">THE PATTERN THAT KEEPS SHOWING UP</div>
                        <div class="sabotage-text"><strong>Your Pattern:</strong> ${formatTextWithParagraphBreaks(patternExactWords)}</div>
                        <div class="sabotage-text" style="margin-top: 15px;"><strong>This pattern shows up most when:</strong> ${patternTrigger}</div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">WHAT I'M HEARING</div>
                        <div class="sabotage-text">${formatTextWithParagraphBreaks(patternReframe)}</div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">WHAT IT'S PROTECTING YOU FROM</div>
                        <div class="sabotage-text">${formatTextWithParagraphBreaks(whatItsProtectingFrom)}</div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">WHAT IT'S COSTING YOU</div>
                        <div class="sabotage-text">${formatTextWithParagraphBreaks(whatItsCosting)}</div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">YOUR PROOF YOU'RE NOT DONE</div>
                        <div class="sabotage-text">${formatTextWithParagraphBreaks(proofWithContext)}</div>
                    </div>
                    
                    <div class="sabotage-section">
                        <div class="block-title">YOUR ANCHOR</div>
                        <div class="sabotage-text">The one thing you never skip: <strong>${anchorHabit}</strong></div>
                    </div>
                    
                    <div class="sabotage-section" style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(201, 169, 110, 0.3);">
                        <div class="sabotage-text"><strong>Personalized Chef-to-Chef Truth:</strong> ${formatTextWithParagraphBreaks(personalizedChefTruth)}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- PAGE 3: YOUR ROADMAP -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">The Way Forward</div>
                    <div class="section-title">Your Roadmap</div>
                </div>
                
                <div class="roadmap-flow">
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--dark-olive);">🔥</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">WHO ARE YOU WITHOUT THE WHITES?</div>
                        <div class="roadmap-brief">${identityBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--dark-olive);">🛠</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">DO YOU STILL LOVE THE LINE?</div>
                        <div class="roadmap-brief">${craftBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--dark-olive);">🎯</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">WHAT'S YOUR SIGNATURE DISH?</div>
                        <div class="roadmap-brief">${purposeBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--dark-olive);">⚙️</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">THE KITCHEN VS. THE LIFE</div>
                        <div class="roadmap-brief">${environmentBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--dark-olive);">🚨</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">THE MISSING QUESTION</div>
                        <div class="roadmap-brief">${missingBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--soft-gold); color: var(--deep-charcoal);">→</div>
                        <div class="roadmap-arrow"></div>
                        <div class="roadmap-label">72-HOUR ACTION</div>
                        <div class="roadmap-brief">${seventyTwoBrief}</div>
                    </div>
                    
                    <div class="roadmap-step">
                        <div class="roadmap-letter" style="background: var(--soft-gold); color: var(--deep-charcoal);">→</div>
                        <div class="roadmap-label">30-DAY PROTOCOL</div>
                        <div class="roadmap-brief">${thirtyDayBrief}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 4: DOMAIN BREAKDOWN (PART 1) -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">The Four Domains - Where You Stand</div>
                    <div class="section-title">Domain Breakdown</div>
                </div>
                
                <div class="domain-grid">
                    <div class="domain-card">
                        <div class="domain-card-title">🔥 WHO ARE YOU WITHOUT THE WHITES? (Identity & Story)</div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Current State</div>
                            <div class="domain-card-value">${identityDomain.current_state || identityDomain.current_level || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Block</div>
                            <div class="domain-card-value">${identityDomain.block || identityDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Growth Edge</div>
                            <div class="domain-card-value">${identityDomain.growth_edge || identityDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                    </div>
                    
                    <div class="domain-card">
                        <div class="domain-card-title">🛠 DO YOU STILL LOVE THE LINE? (Craft & Mastery)</div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Current State</div>
                            <div class="domain-card-value">${craftDomain.current_state || craftDomain.current_level || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Block</div>
                            <div class="domain-card-value">${craftDomain.block || craftDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Growth Edge</div>
                            <div class="domain-card-value">${craftDomain.growth_edge || craftDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- PAGE 5: DOMAIN BREAKDOWN (PART 2) -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">The Four Domains - Where You Stand</div>
                    <div class="section-title">Domain Breakdown</div>
                </div>
                
                <div class="domain-grid">
                    <div class="domain-card">
                        <div class="domain-card-title">🎯 WHAT'S YOUR SIGNATURE DISH? (Purpose & Meaning)</div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Current State</div>
                            <div class="domain-card-value">${purposeDomain.current_state || purposeDomain.current_level || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Block</div>
                            <div class="domain-card-value">${purposeDomain.block || purposeDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Growth Edge</div>
                            <div class="domain-card-value">${purposeDomain.growth_edge || purposeDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                    </div>
                    
                    <div class="domain-card">
                        <div class="domain-card-title">⚙️ THE KITCHEN VS. THE LIFE (Environment & Reality)</div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Current State</div>
                            <div class="domain-card-value">${environmentDomain.current_state || environmentDomain.current_level || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Block</div>
                            <div class="domain-card-value">${environmentDomain.block || environmentDomain.growth_opportunities || "Not specified"}</div>
                        </div>
                        <div class="domain-card-row">
                            <div class="domain-card-label">Growth Edge</div>
                            <div class="domain-card-value">${environmentDomain.growth_edge || environmentDomain.growth_opportunities || "Not specified"}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- PAGE 6: KITCHEN ENERGY ASSESSMENT -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">Your Energy State</div>
                    <div class="section-title">Kitchen Energy<br>Assessment</div>
                </div>
                
                <div style="margin-top: 50px;">
                    <div class="content-block">
                        <div class="block-title">Primary State</div>
                        <div class="block-content">${formatTextWithParagraphBreaks(kitchenEnergy.primary_state || "")}</div>
                    </div>
                    <div class="content-block">
                        <div class="block-title">Regulation Capacity</div>
                        <div class="block-content">${formatTextWithParagraphBreaks(kitchenEnergy.regulation_capacity || "")}</div>
                    </div>
                    <div class="content-block">
                        <div class="block-title">Observable Patterns</div>
                        <div class="block-content">
                            ${Array.isArray(kitchenEnergy.observable_patterns) ? kitchenEnergy.observable_patterns.map((pattern: string) => `<p>• ${pattern}</p>`).join("") : formatTextWithParagraphBreaks(kitchenEnergy.observable_patterns_text || "")}
                        </div>
                    </div>
                    <div class="content-block">
                        <div class="block-title">Energy Reality</div>
                        <div class="block-content">${formatTextWithParagraphBreaks(kitchenEnergy.energy_reality || "")}</div>
                    </div>
                </div>
            </div>
        </div>


        <!-- PAGE 7: YOUR PROTOCOL -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">Start Here / Your 30-Day Protocol</div>
                    <div class="section-title">Your Protocol</div>
                </div>
                
                <div style="font-size: 14px; line-height: 1.8; margin-bottom: 30px; font-style: italic; color: var(--deep-charcoal);">
                    ${urgencyStatement || "This pattern once kept you safe. Now it's keeping you stuck."}<br>
                    The cost of staying burnt for another month: ${whatItsCosting}<br>
                    Every second counts, chef. Here's what happens next.
                </div>
                
                <div class="protocol-item">
                    <div class="protocol-timeline">STEP 1: 72-HOUR ACTION</div>
                    <div class="protocol-action">
                        After <strong>${protocolAnchorHabit || anchorHabit}</strong>, <strong>${specificAction}</strong>${timeReps ? ` for ${timeReps}` : ""}
                    </div>
                    ${whyThisWorks ? `<div style="font-size: 12px; color: #666; margin-top: 10px; font-style: italic;"><strong>Why this works:</strong> ${whyThisWorks}</div>` : ""}
                </div>
                
                <div class="protocol-item">
                    <div class="protocol-timeline">STEP 2: READ THIS NOW</div>
                    <div class="protocol-action">
                        ${
                          selectedBook
                            ? `<div style="margin-bottom: 15px;">
                                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; font-family: 'Playfair Display', serif;">📖 ${selectedBook.title}</div>
                                    <div style="font-size: 14px; color: #666; margin-bottom: 20px;">By ${selectedBook.author}</div>
                                    <div style="font-size: 13px; line-height: 1.7; margin-bottom: 15px;"><strong>Why this book, why now:</strong> ${bookWhyNow || selectedBook.why}</div>
                                    <div style="font-size: 11px; color: #999; font-style: italic; margin-top: 10px;">Note: No chapter assignments, no time estimates, no homework bullshit. Just read it.</div>
                                </div>`
                            : `<div style="font-size:15px; line-height:1.7; color:#222;">Kitchen Confidential by Anthony Bourdain - Raw honesty about kitchen life, reconnects you to why you started.</div>`
                        }
                    </div>
                </div>
                
                ${
                  immediatePractice
                    ? `<div class="protocol-item">
                    <div class="protocol-timeline">STEP 3: IMPLEMENT IMMEDIATELY</div>
                    <div class="protocol-action">${formatTextWithParagraphBreaks(immediatePractice)}</div>
                </div>`
                    : ""
                }
                
                <div class="protocol-item" style="margin-top: 50px;">
                    <div class="protocol-timeline">YOUR FIRST 30 DAYS</div>
                    ${
                      week1Focus
                        ? `<div style="margin: 20px 0;">
                        <div style="font-weight: 600; margin-bottom: 8px;">WEEK 1: ${week1Focus}</div>
                        ${week1Chapters ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">📖 Book: ${selectedBook?.title || ""}${week1Chapters ? `, ${week1Chapters}` : ""}</div>` : ""}
                        ${week1Practice ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">🔄 Practice: ${week1Practice}</div>` : ""}
                        ${week1Marker ? `<div style="font-size: 12px; color: #666;">✓ Marker: ${week1Marker}</div>` : ""}
                    </div>`
                        : ""
                    }
                    ${
                      week2Focus
                        ? `<div style="margin: 20px 0;">
                        <div style="font-weight: 600; margin-bottom: 8px;">WEEK 2: ${week2Focus}</div>
                        ${week2Chapters ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">📖 Book: ${selectedBook?.title || ""}${week2Chapters ? `, ${week2Chapters}` : ""}</div>` : ""}
                        ${week2Practice ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">🔄 Practice: ${week2Practice}</div>` : ""}
                        ${week2Marker ? `<div style="font-size: 12px; color: #666;">✓ Marker: ${week2Marker}</div>` : ""}
                    </div>`
                        : ""
                    }
                    ${
                      week3Focus
                        ? `<div style="margin: 20px 0;">
                        <div style="font-weight: 600; margin-bottom: 8px;">WEEK 3: ${week3Focus}</div>
                        ${week3Chapters ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">📖 Book: ${selectedBook?.title || ""}${week3Chapters ? `, ${week3Chapters}` : ""}</div>` : ""}
                        ${week3Practice ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">🔄 Practice: ${week3Practice}</div>` : ""}
                        ${week3Marker ? `<div style="font-size: 12px; color: #666;">✓ Marker: ${week3Marker}</div>` : ""}
                    </div>`
                        : ""
                    }
                    ${
                      week4Focus
                        ? `<div style="margin: 20px 0;">
                        <div style="font-weight: 600; margin-bottom: 8px;">WEEK 4: ${week4Focus}</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">📖 Review key sections that hit hardest</div>
                        ${week4Practice ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">🔄 Practice: ${week4Practice}</div>` : ""}
                        ${week4Marker ? `<div style="font-size: 12px; color: #666;">✓ Marker: ${week4Marker}</div>` : ""}
                    </div>`
                        : ""
                    }
                </div>
                
                ${
                  dailyActions && dailyActions.length > 0
                    ? `<div class="protocol-item" style="margin-top: 50px;">
                        <div class="protocol-timeline">YOUR DAILY ACTIONS (30 DAYS)</div>
                        <div style="margin: 20px 0;">
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 25px; font-size: 11px; line-height: 1.6;">
                            ${dailyActions
                              .map((action: string, index: number) => {
                                // Remove "Day X:" prefix if it's already in the action text
                                const actionText = action.replace(
                                  /^Day \d+:\s*/i,
                                  ""
                                );
                                return `<div style="display: flex; gap: 10px; margin-bottom: 4px;">
                                  <div style="font-weight: 600; color: var(--dark-olive); min-width: 55px; flex-shrink: 0;">Day ${index + 1}:</div>
                                  <div style="color: #666; flex: 1;">${actionText}</div>
                                </div>`;
                              })
                              .join("")}
                          </div>
                        </div>
                      </div>`
                    : ""
                }
                
                <div style="margin-top: 40px; padding: 20px; background: var(--cream); border-left: 3px solid var(--soft-gold);">
                    <div style="font-size: 13px; line-height: 1.8; font-style: italic;">
                        Start tonight. This book explains why grinding harder hasn't worked—and what will.<br><br>
                        You don't have time to waste, chef. Neither did I.<br>
                        — Steve Murphy
                    </div>
                </div>
            </div>
        </div>


        <!-- PAGE 8: BOTTOM LINE + STEVE'S STORY -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">The Reality</div>
                    <div class="section-title">Bottom Line</div>
                </div>
                
                <div style="margin: 40px 0;">
                    <div class="block-content">
                        ${formatTextWithParagraphBreaks(bottomLinePara1)}
                        ${formatTextWithParagraphBreaks(bottomLinePara2)}
                        ${formatTextWithParagraphBreaks(bottomLinePara3)}
                    </div>
                    
                    <div style="margin: 40px 0; padding: 20px; background: var(--cream); border-left: 3px solid var(--soft-gold);">
                        <div style="font-size: 16px; font-weight: 700; line-height: 1.8; color: var(--dark-olive); font-family: 'Playfair Display', serif;">
                            ${bottomLineEmphasis}
                </div>
            </div>
        </div>
        
                <div style="margin-top: 60px; padding-top: 40px; border-top: 2px solid rgba(201, 169, 110, 0.3);">
                    <div class="block-title">STEVE'S NOTE: WHY I DISAPPEARED</div>
                    <div class="block-content">${formatTextWithParagraphBreaks(steveStoryNote)}</div>
                </div>
                
                ${
                  pullQuote
                    ? `<div style="margin-top: 40px; padding: 30px; background: var(--cream); border-left: 3px solid var(--soft-gold);">
                    <div class="pull-quote-text" style="font-size: 20px; margin-bottom: 15px;">"${pullQuote}"</div>
                    <div style="font-size: 11px; letter-spacing: 0.1em; color: #999;">— Your words, from this assessment</div>
                </div>`
                    : ""
                }
            </div>
        </div>
        

        <!-- PAGE 9: WHAT'S NEXT -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">You Have Everything You Need</div>
                    <div class="section-title">What's Next</div>
                </div>
                
                <div style="margin: 40px 0;">
                    <div style="font-size: 14px; line-height: 2; margin-bottom: 30px;">
                        <div style="margin: 10px 0;">✓ Your pattern mapped in kitchen language</div>
                        <div style="margin: 10px 0;">✓ Your kitchen energy understood</div>
                        <div style="margin: 10px 0;">✓ The four domains assessed</div>
                        <div style="margin: 10px 0;">✓ The missing question answered</div>
                        <div style="margin: 10px 0;">✓ Your 72-hour action identified</div>
                        <div style="margin: 10px 0;">✓ Your reading list (one book, no BS)</div>
                        <div style="margin: 10px 0;">✓ Your 30-day protocol ready</div>
                        <div style="margin: 10px 0;">✓ Steve's story—proof transformation is possible</div>
                    </div>
                    
                    <div style="font-size: 16px; font-weight: 600; margin: 40px 0; text-align: center; color: var(--dark-olive);">
                        The Only Thing Left: Take action. Every second counts.
                    </div>
                </div>
                
                <div class="content-block" style="margin-top: 60px;">
                    <div class="block-title">RECOMMENDED NEXT STEPS</div>
                    <div class="block-content">
                        <p style="margin: 0 0 25px 0; line-height: 1.8;"><strong>6-Month Follow-Up Assessment :</strong> After implementing your protocol, we'll reassess your kitchen energy, pattern shifts, domain progress, and next-level growth areas.${sixMonthDate ? ` Recommended for: ${sixMonthDate}` : ""}</p>
                        <p style="margin: 0 0 20px 0; line-height: 1.8;"><strong>Monthly Check-Ins:</strong> Track progress, troubleshoot blocks, adjust protocol. (Coming soon)</p>
                        <p style="margin: 0 0 20px 0; line-height: 1.8;"><strong>Join the Wydaho Warriors Community:</strong> Connect with other chef-owners who've been in the weeds and found the way out. Brotherhood over grinding alone.${communityLink ? ` <a href="${communityLink}" style="color: var(--lime-green); text-decoration: none;">[Community Link]</a>` : ""}</p>
                        <p style="margin: 0 0 20px 0; line-height: 1.8;"><strong>Work With Steve:</strong> Ready for deeper transformation? Life coaching designed specifically for chef-owners who've lost their fire.${coachingLink ? ` <a href="${coachingLink}" style="color: var(--lime-green); text-decoration: none;">https://paperbell.me/wydaho-warriors</a>` : ""}</p>
                        <p style="margin: 0 0 20px 0; line-height: 1.8;"><strong>Contact:</strong> Questions? Need support? Email <a href="mailto:${contactEmail}" style="color: var(--lime-green); text-decoration: none;">${contactEmail}</a></p>
                        <p style="margin: 30px 0 0 0; line-height: 1.8; font-size: 12px; color: #666;"><strong>Emergency Resources:</strong> If you're in crisis: National Suicide Prevention Lifeline: 988<br>Text "HELLO" to 741741 for Crisis Text Line</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 10: DEVELOPMENT REMINDERS -->
        <div class="page">
            <div class="page-content">
                <div class="section-header">
                    <div class="section-label">Remember</div>
                    <div class="section-title">Development Reminders</div>
                </div>
        
                ${developmentReminders
                  .map((reminder: string) => {
                    const parts = reminder.split("—");
                    const title = parts[0]?.trim() || "";
                    const description = parts[1]?.trim() || reminder;
                    return `<div class="reminder-item">
                      <div style="font-weight: 600; margin-bottom: 8px; color: var(--dark-olive);">→ ${title}</div>
                      <div style="font-size: 11px; line-height: 1.6; color: #666; padding-left: 20px;">${description}</div>
                    </div>`;
                  })
                  .join("")}
                
                <div style="margin-top: 50px; padding-top: 30px;">
                  <div class="block-title">A WORD ABOUT REST</div>
                  <div class="block-content" style="font-size: 12px; line-height: 1.8;">
                    God rested. Jesus withdrew from crowds. Rest isn't weakness—it's obedience to how you were designed. (Exodus 20:8-11, Matthew 11:28)
                  </div>
                </div>
                
                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(201, 169, 110, 0.2);">
                  <div class="block-title">A WORD ABOUT LEAVING</div>
                  <div class="block-content" style="font-size: 12px; line-height: 1.8;">
                    If you need to walk away from your restaurant, that's not failure. Sometimes it's faithfulness to what God's calling you toward next. Marco Pierre White walked away at his peak. Maybe you need to as well.
                  </div>
                </div>
                
                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(201, 169, 110, 0.2);">
                  <div class="block-title">A WORD ABOUT COMMUNITY</div>
                  <div class="block-content" style="font-size: 12px; line-height: 1.8;">
                    "Two are better than one... if either of them falls down, one can help the other up." (Ecclesiastes 4:9-10)<br>
                    You weren't meant to grind alone. Brotherhood over isolation. Warriors over warm bodies.
                  </div>
                </div>
                
                ${
                  signedPdfUrl
                    ? `
                <div style="text-align: center; margin: 60px 0;">
                    <button 
                        class="pdf-button" 
                        onclick="showPDF()"
                    >
                        View PDF Report
                    </button>
                </div>
                `
                    : ""
                }
            </div>
        </div>

      <script>
        function showPDF() {
          ${
            signedPdfUrl
              ? `
            const link = document.createElement('a');
            link.href = '${signedPdfUrl}';
            link.download = 'your-protocol.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          `
              : `
            alert('PDF is still being generated. Please wait a moment and refresh the page.');
          `
          }
        }
      </script>
    </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
