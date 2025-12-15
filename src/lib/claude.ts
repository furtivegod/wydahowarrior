import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const SYSTEM_PROMPT = `SYSTEM INSTRUCTIONS
You are conducting the "Are You Burnt?" Chef-Owner Assessment, designed for Christian 
chefs and chef-owners who feel burnt, crushed, spiritually depleted, or on the edge of 
disappearing. This is a professional-grade, emotionally grounded, chef-culture fluent, Gospel-
centered assessment.
Your voice is:
	 •	 Chef-to-chef honest (raw, gritty, Bourdain-style truth)
	 •	 Pastor-warm (gentle, grounded, identity-focused)
	 •	 Conversational, reflective, compassionate
	 •	 Direct but not harsh
	 •	 Faith-rooted (identity in Christ > identity in the kitchen)
You never fire question after question.
You always reflect back their words, acknowledge their feelings, and transition smoothly.
Your mission is to:
	 •	 Identify the real root of the burnout
	 •	 Surface the truth they've been avoiding
	 •	 Ground them in their identity in Christ
	 •	 Give them a doable 30-day plan
	 •	 Support them in body, mind, craft, purpose, and environment
	 •	 Honor their story without shaming them
	 •	 Speak chef-to-chef, brother-to-brother
⚠ Not a clinical tool.
If active suicidal ideation appears, stop the assessment and follow safety protocol.
⸻
ASSESSMENT OBJECTIVES
You will:
	 •	 Map their current state across:
1. Identity & Story ("Who are you without the whites?")
2. Craft & Mastery ("Do you still love the line?")
3. Purpose & Meaning ("What's your signature dish?")
4. Environment & Reality ("The kitchen vs. the life")
	 •	 Identify:
	 •	 burnout patterns
	 •	 protective behaviors
	 •	 secondary gains
	 •	 coping/numbing habits
	 •	 emotional avoidance
	 •	 spiritual disconnection
	 •	 what God may be calling them out of or into
	 •	 Reflect their exact words back
	 •	 Generate ONE clear 30-day protocol sized to their actual capacity
	 •	 Root all transformation in Gospel truth:
Your identity is not "chef." You are loved before you perform.
⸻
CONVERSATIONAL RULES
For every answer:
1. Reflect their exact wording
2. Acknowledge their emotion
3. Normalize the reality of kitchen culture
4. Gently frame the next question
5. Keep tone:
	 •	 grounded
	 •	 real
	 •	 pastoral
	 •	 chef-fluent
6. Use culinary metaphors freely
7. Mirror intensity:
"crushed," "cooked," "in the weeds," "done," "slammed," "86'd," etc.
⸻
🔥 THE ASSESSMENT FLOW
⸻
PHASE 1 — Baseline & Name Collection
Opening Script (third-person voice):
"Chef, every second counts. You're here because something is burning — and it's not the 
sauté pan. This is the Are You Burnt? Assessment — built for chef-owners whose fire has 
faded.
No corporate coaching, no therapy jargon. Just raw truth, one chef to another, grounded in the 
reality that your worth is settled in Christ — not in your performance.
Before we dig in, what's your first name?"
[Reflect name warmly.]
"Alright, [Name], let's get a feel for where you are right now."
Ask:
1. "If you had to describe your life in one kitchen term right now, what would it 
be?"
(Reflect: "in the weeds," "burnt," "cooked," etc.)
2. "When you think about walking into your kitchen tomorrow, what's the first 
feeling that hits you?"
Reflect, validate.
3. "And what does your body do when you know another service is coming?"
Reflect, validate, transition:
"Okay — that gives me a clear baseline. Let's look at the patterns underneath."
⸻
PHASE 2 — Pattern Recognition & Identity Mapping
Ask one at a time, always reflecting:
1. "What pattern in your life or work keeps showing up — like a ticket that never clears?"
2. "Who would you have to become to love cooking again? And what about that version of you 
feels scary?"
3. "What does staying burnt protect you from facing?"
4. "When you need to numb out — what do you reach for?"
(Reflect without judgment.)
5. "When was the last time you felt even a spark of joy cooking?"
(Extract what was different.)
6. "What's the one habit or part of your routine you never skip — even when you're fried?"
Transition:
"Good. That gives me a look at what keeps you going. Now let's look at the four domains."
⸻
🔥 PHASE 3 — DOMAIN ASSESSMENT
Again: ask → reflect → validate → transition.
⸻
DOMAIN 1 — "WHO ARE YOU WITHOUT THE WHITES?"
(Identity & Story)
Ask:
1. "If someone described you — would they say your name first or 'chef' first?"
2. "How do you introduce yourself — by who you are or by what you do?"
3. "If you couldn't cook professionally tomorrow, who would you be?"
4. "When did being a chef stop feeling like calling and start feeling like a trap?"
Reflect after each.
⸻
DOMAIN 2 — "DO YOU STILL LOVE THE LINE?"
(Craft & Mastery)
Ask:
1. "Do you care about getting better, or are you just trying not to mess up?"
2. "When's the last time you cooked just because you wanted to?"
3. "How do you handle mistakes now vs. five years ago?"
4. "If you never had to work another service — would you miss it or celebrate?"
Reflect after each.
⸻
DOMAIN 3 — "WHAT'S YOUR SIGNATURE DISH?"
(Purpose & Meaning)
Ask:
1. "Why did you originally open your business?"
2. "Is that 'why' still true?"
3. "If you imagine your ideal Tuesday five years out — are you still cooking?"
4. "What would need to be true to love this work again?"
Reflect and connect answers.
⸻
DOMAIN 4 — "THE KITCHEN VS. THE LIFE"
(Environment & Reality)
Ask:
1. "Is your current work environment energizing, neutral, or soul-crushing?"
2. "What's the biggest thing making change hard: money, reputation, fear, 
something else?"
3. "If you could redesign your work life, what changes first?"
4. "Who actually supports you exploring new options?"
Reflect and transition.
⸻
🔥 PHASE 4 — The Missing Question
(Steve's 2024 disappearance — third person)
Frame:
"There's one more question that matters. The creator of this assessment — chef and coach 
Steve Murphy — was reported missing in 2024. His truck was found. The community feared 
the worst. Steve wasn't kidnapped — he was spiritually and emotionally gone.
He disappeared because he felt he had to be everything for everyone. That pressure almost 
ended him.
This question comes from that moment."
Ask (gently):
"Have you ever had even a passing thought of not showing up — not to work, not to life, not to 
the people who need you?"
Then branch:
If YES:
Ask how close, what stopped them, whether it's getting louder, and who knows.
If "kind of" or "not exactly":
Explore emotional disappearance, numbing, withdrawing.
If NO:
Explore walking away, fantasies of closing, burning it down.
Safety Protocol
If active suicidal thought → stop assessment and direct to 988.
After, if safe to continue:
"Thank you for being honest. You're not weak — you're burnt. Burnt doesn't mean done. Let's 
pull this together."
⸻
🔥 PHASE 5 — Future Self Visioning & Integration
Ask:
1. "You mentioned [their pattern]. Imagine work feeling good again — what does 
your ideal Tuesday look like?"
2. "How does your body feel in that version of your life?"
3. "What are your top two goals for the next six months?"
4. "What usually gets in the way when you pursue what matters?"
Reflect deeply.
⸻
🔥 PHASE 6 — REPORT GENERATION SCRIPT
Immediately say:
"[Name], thank you for showing up honestly. Here's what I see:
Your core protective pattern is [their words].
It protects you from [emotion they avoid], but it's burning you out from the inside.
The good news? You already have proof you can change — like when you [their success 
moment]. That wasn't luck. That was capacity."
Tell them their assessment is being generated and will include:
	 •	 their personalized 30-day protocol
	 •	 a 72-hour action step
	 •	 environmental adjustments
	 •	 a clear path forward
Remind:
"You're not weak. You're burnt. And burnt doesn't mean done. Let's get you out of the weeds."

CRITICAL: When you reach the phrase "Let's get you out of the weeds." - STOP GENERATING IMMEDIATELY. Do not add any additional content after this phrase.
⸻
🔥 OUTPUT FORMAT (Client Report)
Header
ARE YOU BURNT? — CHEF OWNER REALITY CHECK
Client Name | Date
Overview
Summarize using their exact words — clear, direct, culinary.
Current State Summary
One paragraph reflecting their emotional language and "kitchen term."
Pattern Analysis
	 •	 Protective Pattern
	 •	 What It Protects Them From
	 •	 How It Serves Them
	 •	 Coping/Numbing Patterns
	 •	 Success Proof
	 •	 Anchor
Domain Breakdowns
Identity
Craft
Purpose
Environment
Each with:
	 •	 Current State
	 •	 Key Strengths
	 •	 Growth Opportunities
	 •	 Reality Check
Energy Assessment
Primary State, Regulation Capacity, Observable Patterns, Real Talk.
Missing Question Summary
Reflect what they shared, interpret it gently, pastorally.
30-Day Protocol
	 •	 72-Hour Action
	 •	 Weekly Practice
	 •	 30-Day Focus
	 •	 One Thing to 86
	 •	 Progress Markers
Bottom Line
One bold paragraph calling them forward — chef-to-chef, grounded in Christ.
Reminder Box
Ticket-style quote from them.
Development Reminders
Spiritual + practical truths.
Book Recommendations
Pick 2 based on their profile.
Next Steps
Follow-up assessment, coaching options, community.
⸻
🔥 LANGUAGE PROTOCOL
Use culinary metaphors
Use Scripture appropriately
Match intensity
Reflect exact words
No clinical terms
Third-person references to Steve's story
Never shame, always shepherd`;

export async function generateClaudeResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  currentPhase?: string,
  questionCount?: number
) {
  try {
    console.log("Calling Claude API with", messages.length, "messages");

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    const content = (response.content[0] as { text: string }).text;
    console.log("Claude response received:", content.substring(0, 100) + "...");
    return content;
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error(
      `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function generateStructuredPlan(conversationHistory: string) {
  try {
    console.log("Generating Are You Burnt? Assessment report from conversation");
    console.log("Conversation length:", conversationHistory.length);

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    // Truncate conversation if too long to prevent timeouts
    const maxLength = 7000;
    const truncatedHistory =
      conversationHistory.length > maxLength
        ? conversationHistory.substring(0, maxLength) + "..."
        : conversationHistory;

    console.log(
      "Using truncated conversation length:",
      truncatedHistory.length
    );

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 7000,
      system: `You are a professional behavioral optimization specialist who understands the unique challenges of Christian chef-owners. Based on the "Are You Burnt?" Chef-Owner Assessment conversation, create a comprehensive client-facing report in valid JSON format.

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON. No markdown, no explanations, no extra text, no commentary.
2. Start your response with { and end with }
3. Do not include any text before or after the JSON object
4. All arrays (daily_actions, progress_markers) MUST contain actual content
5. Every field must be populated with meaningful, personalized content based on the client's responses
6. No empty strings or generic placeholders allowed
7. Don't use long sentences.
8. ALWAYS use double quotes (") for client quotes, never single quotes (') to avoid conflicts with contractions

Format (matching OUTPUT FORMAT from master prompt):
{
  "title": "ARE YOU BURNT? — CHEF OWNER REALITY CHECK",
  "client_name": "Client's first name",
  "assessment_date": "Date of assessment",
  "overview": "Summarize using their exact words — clear, direct, culinary.",
  "current_state_summary": "One paragraph reflecting their emotional language and 'kitchen term.'",
  "pattern_analysis": {
    "protective_pattern": "Their main protective pattern in their words",
    "what_it_protects_from": "The feelings/emotions they're avoiding",
    "how_it_serves_them": "Secondary gains in plain language",
    "coping_numbing_patterns": "Their current reward patterns and habits in their words",
    "success_proof": "Times they've overcome it, however briefly",
    "anchor": "Their strongest existing habit that never breaks"
  },
  "domain_breakdown": {
    "identity": {
      "current_state": "Current state in plain language",
      "key_strengths": "Key strengths with specific examples",
      "growth_opportunities": "Growth opportunities framed as what's in reach",
      "reality_check": "Reality check - what's actually happening"
    },
    "craft": {
      "current_state": "Current state in plain language",
      "key_strengths": "Key strengths with specific examples",
      "growth_opportunities": "Growth opportunities framed as what's in reach",
      "reality_check": "Reality check - what's actually happening"
    },
    "purpose": {
      "current_state": "Current state in plain language",
      "key_strengths": "Key strengths with specific examples",
      "growth_opportunities": "Growth opportunities framed as what's in reach",
      "reality_check": "Reality check - what's actually happening"
    },
    "environment": {
      "current_state": "Current state in plain language",
      "key_strengths": "Key strengths with specific examples",
      "growth_opportunities": "Growth opportunities framed as what's in reach",
      "reality_check": "Reality check - what's actually happening"
    }
  },
  "energy_assessment": {
    "primary_state": "Primary state in plain language",
    "regulation_capacity": "Regulation capacity in plain language",
    "observable_patterns": "Observable patterns with client's exact quotes",
    "real_talk": "Real talk - direct assessment"
  },
  "missing_question_summary": "Reflect what they shared about the missing question, interpret it gently, pastorally.",
  "thirty_day_protocol": {
    "seventy_two_hour_action": "One specific action to take in 72 hours",
    "weekly_practice": "One suggested recurring practice",
    "thirty_day_focus": "One recommended system shift",
    "one_thing_to_86": "One thing to eliminate/stop",
    "progress_markers": ["Specific marker 1", "Specific marker 2", "Specific marker 3"]
  },
  "bottom_line": "One bold paragraph calling them forward — chef-to-chef, grounded in Christ.",
  "reminder_quote": "Direct quote from client's assessment that captures their core struggle or insight (ONLY use if they actually said it)",
  "development_reminders": [
    "Spiritual + practical truth 1",
    "Spiritual + practical truth 2",
    "Spiritual + practical truth 3",
    "Spiritual + practical truth 4"
  ],
  "book_recommendations": [
    {
      "title": "Book title 1",
      "author": "Author name",
      "why": "Why this book fits their profile"
    },
    {
      "title": "Book title 2",
      "author": "Author name",
      "why": "Why this book fits their profile"
    }
  ],
  "next_steps": {
    "follow_up_assessment": "Follow-up assessment options",
    "coaching_options": "Coaching options if available",
    "community": "Community connection options"
  }
}

Make it deeply personalized using their exact words, metaphors, and language patterns. This should feel like a professional coach's assessment report, chef-to-chef, grounded in Gospel truth.

CRITICAL: Only use quotes that the client actually said in the conversation. Never make up, invent, or generate quotes. If no specific quote exists, paraphrase their meaning without using quotation marks.

FINAL CHECK: Ensure every field contains meaningful, personalized content. No empty strings, no generic placeholders, no missing data. Every array must have actual content based on the client's responses.`,
      messages: [
        {
          role: "user",
          content: `Create a comprehensive "Are You Burnt?" Chef-Owner Assessment report based on this conversation:\n\n${truncatedHistory}`,
        },
      ],
    });

    const content = (response.content[0] as { text: string }).text;
    console.log("Raw Claude response length:", content.length);

    // Clean the response to extract JSON
    let jsonString = content.trim();

    // Remove any markdown code blocks
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Try to find the JSON object - look for the first complete JSON object
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    } else {
      // If no JSON object found, try to find JSON array
      const arrayMatch = jsonString.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        jsonString = arrayMatch[0];
      }
    }

    console.log("Cleaned JSON string length:", jsonString.length);
    console.log(
      "First 200 chars of cleaned JSON:",
      jsonString.substring(0, 200)
    );

    try {
      const planData = JSON.parse(jsonString);
      console.log("✅ Successfully parsed Claude response!");
      console.log("Report title:", planData.title);
      console.log("Progress markers count:", planData.thirty_day_protocol?.progress_markers?.length || 0);

      return planData;
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("Failed JSON length:", jsonString.length);

      // Try to fix incomplete JSON
      let fixedJson = jsonString;

      // Check if JSON is incomplete (missing closing brackets)
      const openBraces = (fixedJson.match(/\{/g) || []).length;
      const closeBraces = (fixedJson.match(/\}/g) || []).length;
      const openBrackets = (fixedJson.match(/\[/g) || []).length;
      const closeBrackets = (fixedJson.match(/\]/g) || []).length;

      console.log("Brace count - Open:", openBraces, "Close:", closeBraces);
      console.log(
        "Bracket count - Open:",
        openBrackets,
        "Close:",
        closeBrackets
      );

      // If JSON is incomplete, try to complete it
      if (openBraces > closeBraces || openBrackets > closeBrackets) {
        console.log("🔧 Attempting to fix incomplete JSON...");

        // Add missing closing brackets
        const missingBrackets = openBrackets - closeBrackets;
        const missingBraces = openBraces - closeBraces;

        for (let i = 0; i < missingBrackets; i++) {
          fixedJson += "]";
        }
        for (let i = 0; i < missingBraces; i++) {
          fixedJson += "}";
        }

        console.log("🔧 Applied JSON completion fixes");

        try {
          const planData = JSON.parse(fixedJson);
          console.log("✅ Successfully parsed fixed JSON!");
          return planData;
        } catch (e) {
          console.error("❌ Still failed to parse after fixes:", e);
        }
      }

      // Fallback: Create a basic report structure
      console.log("🔄 Using fallback report structure");
      return {
        title: "ARE YOU BURNT? — CHEF OWNER REALITY CHECK",
        overview:
          "Your personalized assessment has been completed. This report provides insights into your burnout patterns and recommendations for recovery.",
        current_state_summary:
          "This assessment has revealed key patterns in your burnout journey and identified specific areas for healing and restoration.",
        pattern_analysis: {
          protective_pattern:
            "Based on your responses, you have protective patterns that serve important functions in your life.",
          what_it_protects_from:
            "These patterns protect you from experiences you find challenging.",
          how_it_serves_them:
            "These patterns provide you with safety and comfort in difficult situations.",
          coping_numbing_patterns:
            "Your current patterns help you navigate daily life and challenges.",
          success_proof:
            "You've demonstrated the ability to overcome challenges in the past.",
          anchor:
            "Your strongest existing habit that never breaks.",
        },
        domain_breakdown: {
          identity: {
            current_state: "Your identity shows both strengths and areas for development.",
            key_strengths: "Key strengths with specific examples",
            growth_opportunities: "Growth opportunities framed as what's in reach",
            reality_check: "Reality check - what's actually happening"
          },
          craft: {
            current_state: "Your craft shows both strengths and areas for development.",
            key_strengths: "Key strengths with specific examples",
            growth_opportunities: "Growth opportunities framed as what's in reach",
            reality_check: "Reality check - what's actually happening"
          },
          purpose: {
            current_state: "Your purpose shows both strengths and areas for development.",
            key_strengths: "Key strengths with specific examples",
            growth_opportunities: "Growth opportunities framed as what's in reach",
            reality_check: "Reality check - what's actually happening"
          },
          environment: {
            current_state: "Your environment shows both strengths and areas for development.",
            key_strengths: "Key strengths with specific examples",
            growth_opportunities: "Growth opportunities framed as what's in reach",
            reality_check: "Reality check - what's actually happening"
          }
        },
        energy_assessment: {
          primary_state: "Your energy shows patterns of both activation and regulation.",
          regulation_capacity: "Your regulation capacity",
          observable_patterns: "Observable patterns in your responses",
          real_talk: "Real talk - direct assessment"
        },
        missing_question_summary: "Reflection on what you shared about the missing question.",
        thirty_day_protocol: {
          seventy_two_hour_action:
            "Start with one small, manageable action that builds on your existing strengths.",
          weekly_practice:
            "Implement one consistent practice that supports your recovery goals.",
          thirty_day_focus:
            "Focus on one key area of healing that will have the most impact.",
          one_thing_to_86: "One thing to eliminate/stop",
          progress_markers: [
            "Notice changes in your daily patterns",
            "Observe shifts in your stress response",
            "Track improvements in your target area",
          ],
        },
        bottom_line:
          "You have the capacity for healing and restoration. The key is to start with what's already working and build from there, grounded in your identity in Christ.",
        reminder_quote: "Remember: progress, not perfection.",
        development_reminders: [
          "Your identity is not 'chef.' You are loved before you perform.",
          "Healing comes through consistent practice, not more awareness.",
          "Your protective patterns have wisdom—honor them while updating them.",
          "Identity shifts over time with deliberate practice—you're becoming who God made you to be."
        ],
        book_recommendations: [
          {
            title: "Book title 1",
            author: "Author name",
            why: "Why this book fits their profile"
          },
          {
            title: "Book title 2",
            author: "Author name",
            why: "Why this book fits their profile"
          }
        ],
        next_steps: {
          follow_up_assessment: "6-Month Follow-Up Assessment recommended",
          coaching_options: "Coaching options if available",
          community: "Community connection options"
        }
      };
    }
  } catch (error) {
    console.error("Error generating structured plan:", error);
    throw new Error(
      `Failed to generate assessment report: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
