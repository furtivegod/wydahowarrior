import { supabaseAdmin as supabase } from "@/lib/supabase";

// Function to break text into paragraphs after every 2 sentences and bold quoted text
function formatTextWithParagraphBreaks(text: string | undefined): string {
  if (!text) return "";

  // Bold any quoted text using double quotes only (Claude now uses double quotes for client quotes)
  // This avoids conflicts with contractions that use single quotes
  const formattedText = text.replace(
    /(")([^"]+)\1/g,
    "<strong>$1$2$1</strong>"
  );

  // Split by sentences (ending with . ! or ?)
  const sentences = formattedText
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim());

  // Group sentences into paragraphs of 2
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const paragraphSentences = sentences.slice(i, i + 2);
    paragraphs.push(paragraphSentences.join(" "));
  }

  // Return as HTML paragraphs
  return paragraphs.map((paragraph) => `<p>${paragraph.trim()}</p>`).join("");
}

export interface PlanData {
  title: string;
  client_name?: string;
  assessment_date?: string;
  disclaimer?: string;
  kitchen_term?: string; // Their exact kitchen term - "in the weeds", "burnt", "86'd", etc.
  pattern_analysis?: {
    pattern_exact_words?: string; // Client's exact words about their frustrating pattern
    pattern_reframe?: string; // What I'm hearing - reframe in chef-owner burnout context
    pattern_trigger?: string; // This pattern shows up most when - their specific trigger
    what_it_protects_from?: string; // Specific fear or emotion - not generic
    what_it_costs?: string; // Their actual answer - use ONLY their words
    proof_with_context?: string; // Specific moment of joy/success with context
    anchor_habit?: string; // The one thing you never skip
    personalized_chef_truth?: string; // 2-3 sentences connecting pattern → protection → cost → possibility
    // Legacy fields for backward compatibility
    protective_pattern?: string;
    success_proof?: string;
    anchor?: string;
  };
  roadmap_briefs?: {
    identity_brief?: string;
    craft_brief?: string;
    purpose_brief?: string;
    environment_brief?: string;
    missing_brief?: string;
    seventy_two_brief?: string;
    thirty_day_brief?: string;
  };
  domain_breakdown?: {
    identity?: {
      current_state?: string; // In chef language (Victim/Fighting Back/Finding Self)
      block?: string; // Primary identity obstacle
      growth_edge?: string; // What's possible when this shifts
      // Legacy fields
      current_level?: string;
      key_strengths?: string;
      growth_opportunities?: string;
      reality_check?: string;
    };
    craft?: {
      current_state?: string; // In chef language (Survival Mode/Rediscovering/Mastering)
      block?: string; // Primary craft obstacle
      growth_edge?: string; // How craft reconnection unlocks purpose
      // Legacy fields
      current_level?: string;
      key_strengths?: string;
      growth_opportunities?: string;
      reality_check?: string;
    };
    purpose?: {
      current_state?: string; // In chef language (Lost/Searching/Clear)
      block?: string; // Primary purpose obstacle
      growth_edge?: string; // Path to purpose-driven work
      // Legacy fields
      current_level?: string;
      key_strengths?: string;
      growth_opportunities?: string;
      reality_check?: string;
    };
    environment?: {
      current_state?: string; // In chef language (Trapped/Exploring Options/Making Moves)
      block?: string; // Primary environmental obstacle
      growth_edge?: string; // What changes when environment aligns
      // Legacy fields
      current_level?: string;
      key_strengths?: string;
      growth_opportunities?: string;
      reality_check?: string;
    };
  };
  kitchen_energy_assessment?: {
    primary_state?: string; // In culinary language
    regulation_capacity?: string; // In kitchen terms
    observable_patterns?: string[]; // Array of physical/emotional/behavioral cues
    energy_reality?: string; // 2-3 sentences about kitchen energy state
    // Legacy fields
    observable_patterns_text?: string;
    real_talk?: string;
  };
  missing_question_summary?: string;
  thirty_day_protocol?: {
    urgency_statement?: string; // Cost of staying burnt for another month
    anchor_habit?: string;
    specific_action?: string;
    time_reps?: string;
    why_this_works?: string;
    book_recommendation?: {
      title?: string;
      author?: string;
      why_now?: string; // 2-4 sentences explaining relevance
      asin?: string; // Amazon ASIN
      url?: string; // Affiliate link
    };
    immediate_practice?: string; // Practice from book applied to kitchen life
    week_1_focus?: string;
    week_1_chapters?: string;
    week_1_practice?: string;
    week_1_marker?: string;
    week_2_focus?: string;
    week_2_chapters?: string;
    week_2_practice?: string;
    week_2_marker?: string;
    week_3_focus?: string;
    week_3_chapters?: string;
    week_3_practice?: string;
    week_3_marker?: string;
    week_4_focus?: string;
    week_4_practice?: string;
    week_4_marker?: string;
    daily_actions?: string[]; // Array of 30 daily actions (Day 1 through Day 30)
    // Legacy fields
    seventy_two_hour_suggestion?: string;
    weekly_practice?: string;
    thirty_day_focus?: string;
    progress_markers?: string[];
  };
  bottom_line_breakdown?: {
    pattern_restated?: string;
    what_it_protects?: string;
    what_it_costs?: string;
    the_truth?: string;
    your_proof?: string;
    what_happens_next?: string;
  };
  bottom_line_full?: {
    paragraph_1?: string; // The pattern and its origin
    paragraph_2?: string; // What it's costing and why it matters now
    paragraph_3?: string; // The choice ahead and what's required
    emphasis_statement?: string; // Bold emphasis statement
  };
  steve_story_note?: string;
  pull_quote?: string; // Direct quote from client's assessment
  development_reminders?: string[];
  next_steps?: {
    six_month_date?: string;
    community_link?: string;
    coaching_link?: string;
    contact_email?: string;
    follow_up_assessment?: string;
    coaching_options?: string;
    community?: string;
  };
  // Legacy fields for backward compatibility
  overview?: string;
  current_state_summary?: string;
  bottom_line?: string;
  reminder_quote?: string;
  book_recommendation?: string; // Legacy string format
  book_recommendations?: Array<{
    title: string;
    author: string;
    why: string;
  }>;
}

export async function generatePDF(
  planData: PlanData,
  sessionId: string
): Promise<{ pdfUrl: string; pdfBuffer: Buffer }> {
  try {
    console.log("Generating PDF for session:", sessionId);
    console.log("Plan data received:", {
      title: planData.title,
      overview: planData.overview,
      client_name: planData.client_name,
      kitchen_term: planData.kitchen_term,
    });

    // Check for PDFShift API key
    if (!process.env.PDFSHIFT_API_KEY) {
      console.error("PDFSHIFT_API_KEY not configured");
      throw new Error("PDF generation service not configured");
    }

    // Get user information for client name and session date
    console.log("Fetching user information for client name");
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id, started_at")
      .eq("id", sessionId)
      .single();

    let clientName = "Client";
    let sessionDate: Date | null = null;
    if (!sessionError && sessionData) {
      // Get session date
      if (sessionData.started_at) {
        sessionDate = new Date(sessionData.started_at);
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, user_name")
        .eq("id", sessionData.user_id)
        .single();

      if (!userError && userData) {
        // Use user_name if available, otherwise extract from email
        if (userData.user_name) {
          clientName = userData.user_name;
        } else {
          // Extract name from email if no name is provided
          const emailName = userData.email.split("@")[0];
          clientName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
        console.log("Client name determined:", clientName);
      }
    }

    // Validate data structure
    if (!planData.thirty_day_protocol) {
      planData.thirty_day_protocol = {};
    }

    // Generate HTML content with client name and session date
    const htmlContent = generateHTMLReport(planData, clientName, sessionDate);

    // Convert HTML to PDF using PDFShift
    console.log("Converting HTML to PDF using PDFShift...");
    const pdfBuffer = await convertHTMLToPDF(htmlContent, clientName);

    // Store PDF in Supabase Storage
    const fileName = `protocol-${sessionId}-${Date.now()}.pdf`;
    const filePath = `reports/${fileName}`;

    console.log("Storing PDF in Supabase Storage:", filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading PDF:", uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log("PDF uploaded successfully:", uploadData.path);

    // Generate signed URL for the PDF
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("reports")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    const signedUrl = signedUrlData.signedUrl;
    console.log("Signed URL generated successfully");

    // Store PDF metadata in database (only if sessionId is a valid UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(sessionId)) {
      const { error: dbError } = await supabase.from("pdf_jobs").insert({
        session_id: sessionId,
        status: "completed",
        pdf_url: signedUrl,
        file_path: filePath,
      });

      if (dbError) {
        console.error("Error storing PDF metadata:", dbError);
      }
    } else {
      console.log(
        "Skipping database insert for test session (non-UUID session ID)"
      );
    }

    return { pdfUrl: signedUrl, pdfBuffer };
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function convertHTMLToPDF(
  htmlContent: string,
  clientName: string = "Client"
): Promise<Buffer> {
  try {
    // Create footer HTML with PDFShift variables - matching template design
    const footerHTML = `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 20px; border-top: 1px solid #3D4D2E; border-bottom: 1px solid #3D4D2E; font-size: 11px; color: #666; background: #F5F3ED; font-family: 'Inter', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;"><div>${clientName}</div><div>THE KNIFE CHECK</div></div>`;

    const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`api:${process.env.PDFSHIFT_API_KEY}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: htmlContent,
        format: "A4",
        margin: "15mm",
        footer: {
          source: footerHTML,
          height: "40px", // Space between content and footer
          start_at: 1, // Start footer from page 1
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDFShift API error:", response.status, errorText);
      throw new Error(`PDFShift API error: ${response.status} - ${errorText}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log("PDF generated successfully via PDFShift");
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("PDFShift conversion error:", error);
    throw new Error(
      `Failed to convert HTML to PDF: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Smart content splitting based on estimated height
function splitContentByHeight(
  items: string[],
  maxItemsPerPage: number = 15
): string[][] {
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentItemCount = 0;

  items.forEach((item, index) => {
    // Estimate item height based on content length
    const estimatedHeight = Math.ceil(item.length / 80) * 1.6; // Rough line estimation
    const maxHeightPerPage = 20; // Estimated max lines per page

    // If adding this item would exceed page capacity, start new page
    if (
      currentItemCount >= maxItemsPerPage ||
      (currentPage.length > 0 && estimatedHeight > maxHeightPerPage)
    ) {
      pages.push([...currentPage]);
      currentPage = [];
      currentItemCount = 0;
    }

    currentPage.push(item);
    currentItemCount++;
  });

  // Add remaining items
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

function generateHTMLReport(
  planData: PlanData,
  clientName: string = "Client",
  sessionDate: Date | null = null
): string {
  // Extract the real data from the assessment - NEW 9-PAGE FRAMEWORK
  const displayClientName = planData.client_name || clientName;
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

  // Extract pattern analysis (NEW STRUCTURE)
  const patternAnalysis = planData.pattern_analysis || {};
  const kitchenTerm = planData.kitchen_term || "burnt";
  const patternExactWords =
    patternAnalysis.pattern_exact_words ||
    patternAnalysis.protective_pattern ||
    "Your pattern keeps showing up";
  const patternReframe =
    patternAnalysis.pattern_reframe ||
    "What I'm hearing: Your pattern in chef-owner burnout context";
  const patternTrigger =
    patternAnalysis.pattern_trigger ||
    "This pattern shows up most when you're in the weeds";
  const whatItProtectsFrom =
    patternAnalysis.what_it_protects_from ||
    "Having to face what's actually burning";
  const whatItCosts =
    patternAnalysis.what_it_costs ||
    "The cost of staying burnt is real, even if you haven't tallied the full bill yet.";
  const proofWithContext =
    patternAnalysis.proof_with_context ||
    patternAnalysis.success_proof ||
    "You've proven you can change—like when you created that moment of joy. That wasn't luck. That was you.";
  const anchorHabit =
    patternAnalysis.anchor_habit ||
    patternAnalysis.anchor ||
    "The one thing you never skip";
  const personalizedChefTruth =
    patternAnalysis.personalized_chef_truth ||
    "You're not burnt because you're soft—you're burnt because you've been running on empty while filling everyone else's plates.";

  // Extract roadmap briefs (NEW STRUCTURE)
  const roadmapBriefs = planData.roadmap_briefs || {};
  const identityBrief =
    roadmapBriefs.identity_brief || "Your identity pattern, what it's costing";
  const craftBrief =
    roadmapBriefs.craft_brief ||
    "Your relationship with craft, where joy still lives";
  const purposeBrief =
    roadmapBriefs.purpose_brief || "Your purpose now vs. original why";
  const environmentBrief =
    roadmapBriefs.environment_brief ||
    "Your environment reality, biggest obstacle";
  const missingBrief =
    roadmapBriefs.missing_brief || "Where you really are, what you revealed";
  const seventyTwoBrief =
    roadmapBriefs.seventy_two_brief ||
    "One specific action sized to your current state";
  const thirtyDayBrief =
    roadmapBriefs.thirty_day_brief ||
    "The sustained practice that changes everything";

  // Extract domain breakdown (NEW STRUCTURE - identity, craft, purpose, environment)
  const domainBreakdown = planData.domain_breakdown || {};
  const identityDomain = domainBreakdown.identity || {
    current_state: "Finding Self",
    block: "Primary identity obstacle",
    growth_edge: "What's possible when this shifts",
  };
  const craftDomain = domainBreakdown.craft || {
    current_state: "Rediscovering",
    block: "Primary craft obstacle",
    growth_edge: "How craft reconnection unlocks purpose",
  };
  const purposeDomain = domainBreakdown.purpose || {
    current_state: "Searching",
    block: "Primary purpose obstacle",
    growth_edge: "Path to purpose-driven work",
  };
  const environmentDomain = domainBreakdown.environment || {
    current_state: "Exploring Options",
    block: "Primary environmental obstacle",
    growth_edge: "What changes when environment aligns",
  };

  // Extract kitchen energy assessment (NEW STRUCTURE)
  const kitchenEnergy = planData.kitchen_energy_assessment || {};
  const primaryEnergyState =
    kitchenEnergy.primary_state ||
    "In the Weeds: Running on stress and obligation";
  const regulationCapacity =
    kitchenEnergy.regulation_capacity ||
    "Developing: Can stay loose in low-pressure situations";
  const observablePatterns = Array.isArray(kitchenEnergy.observable_patterns)
    ? kitchenEnergy.observable_patterns
    : kitchenEnergy.observable_patterns_text
      ? [kitchenEnergy.observable_patterns_text]
      : ["Physical cue", "Emotional cue", "Behavioral cue"];
  const energyReality =
    kitchenEnergy.energy_reality ||
    "You're not running out of steam—you're running on fumes pretending it's fuel.";

  // Extract 30-day protocol (NEW STRUCTURE)
  const thirtyDayProtocol = planData.thirty_day_protocol || {};
  const urgencyStatement =
    thirtyDayProtocol.urgency_statement ||
    "This pattern once kept you safe. Now it's keeping you stuck.";
  const protocolAnchorHabit = thirtyDayProtocol.anchor_habit || anchorHabit;
  const specificAction =
    thirtyDayProtocol.specific_action ||
    "Take 3 deep breaths and ask yourself one question";
  const timeReps = thirtyDayProtocol.time_reps || "2 minutes";
  const whyThisWorks =
    thirtyDayProtocol.why_this_works ||
    "This builds on your existing anchor and creates a new pattern";
  const immediatePractice =
    thirtyDayProtocol.immediate_practice ||
    "Practice from book applied to your specific kitchen life";

  // Weekly breakdown
  const week1Focus = thirtyDayProtocol.week_1_focus || "Foundation";
  const week1Chapters = thirtyDayProtocol.week_1_chapters || "";
  const week1Practice = thirtyDayProtocol.week_1_practice || "";
  const week1Marker = thirtyDayProtocol.week_1_marker || "";
  const week2Focus = thirtyDayProtocol.week_2_focus || "Pattern Recognition";
  const week2Chapters = thirtyDayProtocol.week_2_chapters || "";
  const week2Practice = thirtyDayProtocol.week_2_practice || "";
  const week2Marker = thirtyDayProtocol.week_2_marker || "";
  const week3Focus = thirtyDayProtocol.week_3_focus || "Implementation";
  const week3Chapters = thirtyDayProtocol.week_3_chapters || "";
  const week3Practice = thirtyDayProtocol.week_3_practice || "";
  const week3Marker = thirtyDayProtocol.week_3_marker || "";
  const week4Focus = thirtyDayProtocol.week_4_focus || "Integration";
  const week4Practice = thirtyDayProtocol.week_4_practice || "";
  const week4Marker = thirtyDayProtocol.week_4_marker || "";

  // Extract book recommendation (NEW - single book from protocol)
  const bookRec = thirtyDayProtocol.book_recommendation || {};
  const bookTitle = bookRec.title || "";
  const bookAuthor = bookRec.author || "";
  const bookWhyNow = bookRec.why_now || "";

  // Ensure arrays are properly validated (if needed for future use)
  const progressMarkers = Array.isArray(
    planData.thirty_day_protocol?.progress_markers
  )
    ? planData.thirty_day_protocol.progress_markers
    : [];

  // Extract daily actions (30-day protocol)
  const dailyActions = Array.isArray(thirtyDayProtocol.daily_actions)
    ? thirtyDayProtocol.daily_actions
    : [];

  // Chef-owner specific book list (9-PAGE FRAMEWORK)
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

  // Select book - use provided book from protocol, or select based on pattern
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
      whatItProtectsFrom +
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

  // Extract bottom line full (3 paragraphs + emphasis)
  const bottomLineFull = planData.bottom_line_full || {};
  const bottomLinePara1 =
    bottomLineFull.paragraph_1 ||
    "You built your identity around being the chef who never breaks, never complains, never needs help. That identity served you when you were fighting to prove yourself. But now it's a cage.";
  const bottomLinePara2 =
    bottomLineFull.paragraph_2 ||
    "Staying stuck is costing you. More importantly, it's costing you the life you described—the one with purpose over paper, mission over money.";
  const bottomLinePara3 =
    bottomLineFull.paragraph_3 ||
    "You have a choice: keep managing the chaos until something breaks, or face what's actually burning and 86 it. This isn't about working harder. You've proven you can grind. This is about working differently.";
  const bottomLineEmphasis =
    bottomLineFull.emphasis_statement ||
    "You're not stuck because you don't know what to do. You're stuck because you haven't protected your purpose like you protected your sobriety.";

  // Extract Steve's story
  const steveStoryNote =
    planData.steve_story_note ||
    `January 2024. Driggs, Idaho. My white Tundra was found. Search and rescue went out. My two boys didn't know where their dad was. I wasn't kidnapped. I wasn't in an accident. I was lost—not physically, but in every way that mattered. I'd spent years being everything for everyone. The chef. The owner. The provider. The guy who never said no, never took a break, never admitted he was drowning. I thought that was strength. It wasn't. It was slow suicide. When they found me safe, I had a choice: keep grinding until I actually didn't come back, or face the truth that I needed help. I chose help. That's why I'm here now. That's why you took this assessment. You don't have to disappear to find yourself. But you do have to face what's actually burning.`;

  // Extract pull quote
  const pullQuote =
    planData.pull_quote ||
    proofWithContext ||
    patternExactWords ||
    "Your words from this assessment";

  // Extract missing question summary
  const missingQuestionSummary =
    planData.missing_question_summary ||
    "Reflection on what you shared about the missing question.";

  // Extract development reminders (NEW - 4 core reminders)
  const developmentRemindersFinal = Array.isArray(
    planData.development_reminders
  )
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
  const communityLink =
    nextSteps.community_link || "https://wwassessment.com/community";
  const coachingLink =
    nextSteps.coaching_link || "https://paperbell.me/wydaho-warriors";
  const contactEmail = nextSteps.contact_email || "info@wwassessment.com";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${planData.title || "WW Knife Check Assessment Report"}</title>
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
          page-break-after: always;
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
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
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
          margin: 0 0 80px 0;
          font-weight: 500;
          text-align: center;
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
          margin: 80px 0 0 0;
          line-height: 1.6;
          text-align: center;
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
          margin-bottom: 20px;
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
          margin: 25px 0;
        }

        .content-block:first-child {
          margin-top: 0;
        }

        .content-block:last-child {
          margin-bottom: 0;
        }

        .block-title {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--soft-gold);
          font-weight: 500;
          margin-bottom: 15px;
        }

        .block-content {
          font-size: 13px;
          line-height: 1.8;
          font-weight: 400;
        }

        .block-content p {
          margin-bottom: 16px;
          text-align: justify;
          line-height: 1.6;
        }

        .block-content p:last-child {
          margin-bottom: 0;
        }

        /* DOMAIN HERO */
        .domain-hero {
          font-size: 72px;
          font-weight: 700;
          color: var(--dark-olive);
          text-align: center;
          margin-bottom: 50px;
          letter-spacing: -0.03em;
          font-family: 'Playfair Display', serif;
        }

        /* METRICS */
        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
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
          font-weight: 400;
        }

        .metric-value {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 400;
          margin-left: 60px;
        }

        /* PULL QUOTE */
        .pull-quote {
          margin: 40px 0;
          padding: 30px 0;
          border-top: 1px solid rgba(201, 169, 110, 0.3);
          border-bottom: 1px solid rgba(201, 169, 110, 0.3);
          text-align: center;
        }
        
        .pull-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        /* REMINDER BOX PAGE */
        .reminder-box-page {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* BOTTOM LINE */
        .bottom-line-page {
          background: var(--deep-charcoal);
          color: var(--warm-white);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-line-page h2 {
          color: var(--warm-white);
        }

        .bottom-line-page p {
          font-size: 15px;
          line-height: 2;
          color: rgba(255,255,255,0.85);
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

        p {
          margin-bottom: 18px;
          line-height: 1.6;
        }

        /* PROTOCOL */
        .protocol-item {
          margin: 30px 0;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .protocol-timeline {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--soft-gold);
          font-weight: 500;
          margin-bottom: 10px;
        }

        .protocol-action {
          font-size: 14px;
          line-height: 1.6;
          font-weight: 400;
        }

        .protocol-goals {
          margin-top: 20px;
          padding-left: 20px;
        }

        .goal-item {
          padding: 8px 0;
          font-size: 12px;
          line-height: 1.5;
          color: #666;
          border-left: 2px solid var(--soft-gold);
          padding-left: 15px;
          margin-bottom: 8px;
        }

        /* REMINDERS */
        .reminder-item {
          padding: 15px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-size: 12px;
          line-height: 1.7;
          font-weight: 400;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        /* DEVELOPMENT PROFILE */
        .development-profile-content {
          margin-top: 40px;
        }

        .profile-text {
          font-size: 14px;
          line-height: 1.8;
          margin-bottom: 50px;
          text-align: left;
        }

        .your-words-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(201, 169, 110, 0.3);
        }

        .your-words-quote {
          font-size: 16px;
          font-style: italic;
          line-height: 1.6;
          color: var(--deep-charcoal);
          font-family: 'Playfair Display', serif;
          text-align: center;
          padding: 20px 0;
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
      </style>
    </head>
    <body>
      <!-- PAGE 1: COVER -->
      <div class="page cover">
        <div class="cover-content">
          <h1>ARE YOU BURNT?<br>CHEF OWNER<br>REALITY CHECK</h1>
          <div class="client-name">${displayClientName}</div>
          <div style="font-size: 18px; font-weight: 500; color: var(--deep-charcoal); margin-top: 60px; font-style: italic; font-family: 'Playfair Display', serif;">Every second counts, chef.</div>
          <div style="font-size: 12px; color: #666; margin-top: 10px;">— Steve Murphy</div>
          <div style="font-size: 10px; color: #999; margin-top: 80px; letter-spacing: 0.1em;">Culinary Institute of America</div>
          <div style="font-size: 10px; color: #999; letter-spacing: 0.1em;">Wydaho Warriors LLC</div>
        </div>
      </div>
        
      <!-- PAGE 2: YOUR CURRENT STATE -->
      <div class="page" style="page-break-before: always;">
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
              <div class="sabotage-text">${formatTextWithParagraphBreaks(whatItProtectsFrom)}</div>
            </div>
            
            <div class="sabotage-section">
              <div class="block-title">WHAT IT'S COSTING YOU</div>
              <div class="sabotage-text">${formatTextWithParagraphBreaks(whatItCosts)}</div>
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
      <div class="page" style="page-break-before: always;">
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
      <div class="page" style="page-break-before: always;">
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
      <div class="page" style="page-break-before: always;">
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
      </div>
        
      <!-- PAGE 6: KITCHEN ENERGY ASSESSMENT -->
      <div class="page" style="page-break-before: always;">
        <div class="page-content">
          <div class="section-header">
            <div class="section-label">Your Energy State</div>
            <div class="section-title">Kitchen Energy<br>Assessment</div>
          </div>
          
          <div style="margin-top: 50px;">
            <div class="content-block">
              <div class="block-title">Primary State</div>
              <div class="block-content">${formatTextWithParagraphBreaks(primaryEnergyState)}</div>
            </div>
            <div class="content-block">
              <div class="block-title">How You Handle the Heat</div>
              <div class="block-content">${formatTextWithParagraphBreaks(regulationCapacity)}</div>
            </div>
            <div class="content-block">
              <div class="block-title">Observable Patterns</div>
              <div class="block-content">
                ${observablePatterns.map((pattern: string) => `<p>• ${pattern}</p>`).join("")}
              </div>
            </div>
            <div class="content-block">
              <div class="block-title">The Energy Reality</div>
              <div class="block-content">${formatTextWithParagraphBreaks(energyReality)}</div>
            </div>
          </div>
        </div>
      </div>
        
      <!-- PAGE 7: YOUR PROTOCOL -->
      <div class="page" style="page-break-before: always;">
        <div class="page-content">
          <div class="section-header">
            <div class="section-label">Start Here / Your 30-Day Protocol</div>
            <div class="section-title">Your Protocol</div>
          </div>
          
          <div style="font-size: 14px; line-height: 1.8; margin-bottom: 30px; font-style: italic; color: var(--deep-charcoal);">
            ${urgencyStatement || "This pattern once kept you safe. Now it's keeping you stuck."}<br>
            The cost of staying burnt for another month: ${whatItCosts}<br>
            Every second counts, chef. Here's what happens next.
          </div>
          
          <div class="protocol-item">
            <div class="protocol-timeline">STEP 1: 72-HOUR ACTION</div>
            <div class="protocol-action">
              After <strong>${anchorHabit}</strong>, <strong>${specificAction}</strong>${timeReps ? ` for ${timeReps}` : ""}
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
                  .map((action, index) => {
                    // Remove "Day X:" prefix if it's already in the action text
                    const actionText = action.replace(/^Day \d+:\s*/i, "");
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
      <div class="page" style="page-break-before: always;">
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
      <div class="page" style="page-break-before: always;">
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
      <div class="page" style="page-break-before: always;">
        <div class="page-content">
          <div class="section-header">
            <div class="section-label">Remember</div>
            <div class="section-title">Development Reminders</div>
          </div>
      
          ${developmentRemindersFinal
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
        </div>
      </div>

    </body>
    </html>
  `;
}

// Function to get signed URL for existing PDF
export async function getSignedPDFUrl(
  sessionId: string
): Promise<string | null> {
  try {
    console.log("Getting signed URL for session:", sessionId);

    // Get the latest PDF job for this session
    const { data: pdfJob, error: jobError } = await supabase
      .from("pdf_jobs")
      .select("file_path, status")
      .eq("session_id", sessionId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (jobError || !pdfJob) {
      console.log("No completed PDF found for session:", sessionId);
      return null;
    }

    // Generate new signed URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("reports")
        .createSignedUrl(pdfJob.file_path, 60 * 60 * 24 * 7); // 7 days expiry

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      return null;
    }

    return signedUrlData.signedUrl;
  } catch (error) {
    console.error("Error getting signed PDF URL:", error);
    return null;
  }
}
