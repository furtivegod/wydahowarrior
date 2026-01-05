import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { PlanData } from "./pdf";
import { emailTranslations } from "./email-translations";
import { Language } from "./i18n";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend requires the "from" domain to be verified.
// Use env overrides so production can change domains without code edits.
const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Wydaho Warrior Knife Check Assessment <noreply@wwassessment.com>";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "steve@wydahowarriors.com";

export async function sendMagicLink(
  email: string,
  sessionId: string,
  firstName?: string,
  language: Language = "en"
) {
  console.log("Email service called with:", { email, sessionId, firstName });

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL not configured");
  }

  // Use provided firstName or extract from email as fallback
  const displayName =
    firstName ||
    (() => {
      const emailPrefix = email.split("@")[0];
      return emailPrefix.includes(".")
        ? emailPrefix.split(".")[0].charAt(0).toUpperCase() +
            emailPrefix.split(".")[0].slice(1)
        : emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    })();

  const t = emailTranslations[language];

  try {
    console.log("Sending email via Resend...");
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      replyTo: SUPPORT_EMAIL,
      subject: t.magicLink.subject,
      html: `
        <!DOCTYPE html>

        <html lang="${language}">
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Wydaho Warrior Knife Check Assessment Is Ready</title>
            <style>
                @media only screen and (min-width: 600px) {
                    .cta-button:hover {
                        background: #6BB81A !important;
                    }
                }
                
                @media only screen and (max-width: 600px) {
                    .email-container {
                        width: 100% !important;
                    }
                    
                    h1 {
                        font-size: 24px !important;
                    }
                    
                    .cta-button {
                        padding: 14px 32px !important;
                        font-size: 15px !important;
                    }
                    
                    .instruction-text {
                        font-size: 13px !important;
                        padding: 0 30px !important;
                    }
                }
            </style>
        </head>

        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
            <!-- Logo -->

                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW mark.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Greeting -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #3D4D2E; letter-spacing: -0.5px; line-height: 1.2; font-family: 'Playfair Display', Georgia, serif;">
                                        <span style="color: #3D4D2E;">${displayName}</span>,
            </h1>

                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="20"></td>
                            </tr>
                            
                            <!-- Main Message -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="margin: 0; font-size: 18px; font-weight: 400; color: #1A1A1A; line-height: 1.6; font-family: 'Inter', -apple-system, sans-serif;">
                                        ${t.magicLink.greeting}
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="50"></td>
                            </tr>
            
            <!-- CTA Button -->

                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/assessment/${sessionId}?token=${jwt.sign({ sessionId, email }, process.env.JWT_SECRET!, { expiresIn: "7d" })}&lang=${language}" class="cta-button" style="display: inline-block; background: #7ED321; color: #FFFFFF; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 600; letter-spacing: 0.3px; transition: background 0.2s ease; font-family: 'Inter', -apple-system, sans-serif;">
                                        ${t.magicLink.beginButton}
                                    </a>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Instructions -->
                            <tr>
                                <td align="center" class="instruction-text" style="padding: 0 60px;">
                                    <p style="margin: 0; font-size: 14px; font-weight: 400; color: #1A1A1A; line-height: 1.8; font-family: 'Inter', -apple-system, sans-serif;">
                                        ${t.magicLink.instructions}
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
          <!-- Footer -->

                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
                                        ${t.magicLink.support} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="40"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
            
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Magic link email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send magic link:", error);
    throw error;
  }
}

export async function sendReportEmail(
  email: string,
  userName: string,
  pdfUrl: string,
  pdfBuffer?: Buffer,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending report email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    console.log("Sending email via Resend...");

    // Extract first name from userName
    const firstName =
      userName?.split(" ")[0] ||
      email
        .split("@")[0]
        .split(".")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
        .split(" ")[0];

    // Get translations
    const t = emailTranslations[language];
    const bookCallLink = t.report.bookCall;

    // Extract pull quote and 72-hour action from planData
    const pullQuote = planData?.pull_quote || "";
    const seventyTwoAction =
      planData?.roadmap_briefs?.seventy_two_brief ||
      planData?.thirty_day_protocol?.immediate_practice ||
      (language === "es"
        ? "Toma el primer paso de tu evaluación"
        : "Take the first step from your assessment");

    // Generate personalized P.S. based on assessment data (Email 1 P.S. variations)
    let personalizedPS = "";
    if (planData) {
      const patternAnalysis = planData.pattern_analysis;
      const domainBreakdown = planData.domain_breakdown;
      const thirtyDayProtocol = planData.thirty_day_protocol;

      // Check for specific stuck pattern (highest priority)
      if (
        patternAnalysis?.pattern_exact_words ||
        patternAnalysis?.protective_pattern
      ) {
        const patternText =
          patternAnalysis.pattern_exact_words ||
          patternAnalysis.protective_pattern ||
          "";
        personalizedPS = t.report.psPattern
          .replace("{pattern}", patternText)
          .replace("{bookCall}", bookCallLink);
      }
      // Check for business/financial goals in protocol
      else if (
        thirtyDayProtocol?.immediate_practice &&
        (thirtyDayProtocol.immediate_practice
          .toLowerCase()
          .includes("business") ||
          thirtyDayProtocol.immediate_practice
            .toLowerCase()
            .includes("financial") ||
          thirtyDayProtocol.immediate_practice
            .toLowerCase()
            .includes("career") ||
          thirtyDayProtocol.immediate_practice
            .toLowerCase()
            .includes("money") ||
          thirtyDayProtocol.immediate_practice.toLowerCase().includes("income"))
      ) {
        const goalText = thirtyDayProtocol.immediate_practice;
        personalizedPS = t.report.psBusiness
          .replace("{goal}", goalText)
          .replace("{bookCall}", bookCallLink);
      }
      // Check for relationship concerns
      else if (
        domainBreakdown?.purpose &&
        (domainBreakdown.purpose.current_state
          ?.toLowerCase()
          .includes("relationship") ||
          domainBreakdown.purpose.current_state
            ?.toLowerCase()
            .includes("partner") ||
          domainBreakdown.purpose.current_state
            ?.toLowerCase()
            .includes("family") ||
          domainBreakdown.purpose.current_state
            ?.toLowerCase()
            .includes("connection") ||
          domainBreakdown.purpose.current_state
            ?.toLowerCase()
            .includes("intimacy"))
      ) {
        const relationshipText = domainBreakdown.purpose.current_state || "";
        personalizedPS = t.report.psRelationship
          .replace("{text}", relationshipText)
          .replace("{bookCall}", bookCallLink);
      }
      // Check for physical/craft disconnect
      else if (
        domainBreakdown?.craft &&
        (domainBreakdown.craft.current_state
          ?.toLowerCase()
          .includes("disconnect") ||
          domainBreakdown.craft.current_state?.toLowerCase().includes("body") ||
          domainBreakdown.craft.current_state
            ?.toLowerCase()
            .includes("physical") ||
          domainBreakdown.craft.current_state
            ?.toLowerCase()
            .includes("health") ||
          domainBreakdown.craft.current_state
            ?.toLowerCase()
            .includes("exercise"))
      ) {
        const bodyText = domainBreakdown.craft.current_state || "";
        personalizedPS = t.report.psCraft
          .replace("{text}", bodyText)
          .replace("{bookCall}", bookCallLink);
      }
      // Fallback for general transformation goals
      else if (thirtyDayProtocol?.immediate_practice) {
        const goalText = thirtyDayProtocol.immediate_practice;
        personalizedPS = t.report.psGeneral
          .replace("{goal}", goalText)
          .replace("{bookCall}", bookCallLink);
      }
      // Final fallback
      else {
        personalizedPS = t.report.psFallback.replace(
          "{bookCall}",
          bookCallLink
        );
      }
    }

    const emailData: {
      from: string;
      to: string[];
      subject: string;
      html: string;
      attachments?: Array<{ filename: string; content: string; type?: string }>;
    } = {
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: t.report.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <!-- Main Content -->

            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              <strong style="font-family: 'Playfair Display', serif; font-weight: 700; color: #3D4D2E;">Chef ${firstName},</strong><br><br>
              ${t.report.completeAssessmentAttached}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.beforeYouRead}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.everythingMadeSense}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.questionNow}
            </p>
            
            ${
              pullQuote
                ? `
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.youSaidQuote.replace("{quote}", pullQuote)}
            </p>
            `
                : ""
            }

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.readReportReady}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.notAboutFixing}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              <strong>${t.report.your72HourAction}</strong> ${seventyTwoAction}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.why72Hours}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              ${t.report.everySecondCounts}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.report.yourWarrior}<br>
              ${t.report.chefSteve}<br>
              ${t.report.founderCoach}<br>
              ${t.report.company}<br>
              <a href="mailto:${t.report.email}" style="color: #7ED321; text-decoration: underline;">${t.report.email}</a><br>
              ${t.report.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.report.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
            
            <!-- PDF Attachment Notice -->
            <div style="text-align: center; margin: 40px 0;">
              <p style="color: #3D4D2E; font-size: 18px; font-weight: 600; margin: 0; font-family: 'Inter', sans-serif;">
                ${t.report.pdfAttached}
                </p>
            </div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.patternRecognition.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    };

    // Add PDF attachment if buffer is provided
    if (pdfBuffer) {
      emailData.attachments = [
        {
          filename: "your-personalized-protocol.pdf",
          content: pdfBuffer.toString("base64"),
          type: "application/pdf",
        },
      ];
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Report email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send report email:", error);
    throw error;
  }
}

// Email 2: Pattern Recognition (48 hours)

export async function sendPatternRecognitionEmail(
  email: string,
  userName: string,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending pattern recognition email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

    // Get translations
    const t = emailTranslations[language];
    const bookCallLink = t.patternRecognition.bookCall;

    // Generate personalized P.S. based on nervous system pattern (Email 2 P.S. variations)
    let personalizedPS = "";
    if (planData) {
      const kitchenEnergy = planData.kitchen_energy_assessment;
      const primaryState = kitchenEnergy?.primary_state?.toLowerCase() || "";
      const regulationCapacity =
        kitchenEnergy?.regulation_capacity?.toLowerCase() || "";
      const combined = (primaryState + " " + regulationCapacity).toLowerCase();

      // Check for stress/overthinking (sympathetic activation)
      if (
        combined.includes("sympathetic") ||
        combined.includes("stress") ||
        combined.includes("overthinking") ||
        combined.includes("anxious") ||
        combined.includes("hypervigilant")
      ) {
        personalizedPS = t.patternRecognition.psSympathetic.replace(
          "{bookCall}",
          bookCallLink
        );
      }
      // Check for avoidance/shutdown (dorsal shutdown)
      else if (
        combined.includes("dorsal") ||
        combined.includes("avoidance") ||
        combined.includes("numbing") ||
        combined.includes("shutdown") ||
        combined.includes("disconnect") ||
        combined.includes("numb")
      ) {
        personalizedPS = t.patternRecognition.psDorsal.replace(
          "{bookCall}",
          bookCallLink
        );
      }
      // Check for stress regression
      else if (
        combined.includes("regression") ||
        combined.includes("ventral") ||
        combined.includes("regulation")
      ) {
        personalizedPS = t.patternRecognition.psRegression.replace(
          "{bookCall}",
          bookCallLink
        );
      }
      // Generic fallback
      else {
        personalizedPS = t.patternRecognition.psGeneric.replace(
          "{bookCall}",
          bookCallLink
        );
      }
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: t.patternRecognition.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>${firstName},</strong><br><br>
              ${t.patternRecognition.greeting}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.maybeClarity}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.orFeltMotivated.replace("{pattern}", planData?.pattern_analysis?.pattern_exact_words || planData?.pattern_analysis?.anchor_habit || (language === "es" ? "tomar acción" : "take action")).replace("{anchor}", planData?.pattern_analysis?.anchor_habit || (language === "es" ? "tu patrón de escape habitual" : "your usual escape pattern"))}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.notFailure}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.differenceNow}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.awarenessGap}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.inKitchen}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.yourLifeWorks}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.notSmallProgress}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.questionIs}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.patternRecognition.yourWarrior}<br>
              ${t.patternRecognition.chefSteve}<br>
              ${t.patternRecognition.founderCoach}<br>
              ${t.patternRecognition.company}<br>
              <a href="mailto:${t.patternRecognition.email}" style="color: #7ED321; text-decoration: underline;">${t.patternRecognition.email}</a><br>
              ${t.patternRecognition.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.patternRecognition.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.patternRecognition.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Pattern recognition email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send pattern recognition email:", error);
    throw error;
  }
}

// Email 3: Evidence 7-Day (7 days)

export async function sendEvidence7DayEmail(
  email: string,
  userName: string,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending evidence 7-day email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

    // Get translations
    const t = emailTranslations[language];
    const bookCallLink = t.evidence7Day.bookCall;

    // Generate personalized P.S. based on primary sabotage pattern (Email 3 P.S. variations)
    let personalizedPS = "";
    if (planData) {
      const patternAnalysis = planData.pattern_analysis;
      const patternText =
        patternAnalysis?.pattern_exact_words ||
        patternAnalysis?.protective_pattern ||
        "";
      const patternLower = patternText.toLowerCase();

      // Check for perfectionism/overthinking
      if (
        patternLower.includes("perfectionism") ||
        patternLower.includes("overthinking") ||
        patternLower.includes("perfect") ||
        patternLower.includes("researching")
      ) {
        personalizedPS = t.evidence7Day.psPerfectionism
          .replace("{pattern}", patternText)
          .replace("{bookCall}", bookCallLink);
      }
      // Check for avoidance/procrastination
      else if (
        patternLower.includes("avoidance") ||
        patternLower.includes("procrastination") ||
        patternLower.includes("avoid") ||
        patternLower.includes("delay")
      ) {
        personalizedPS = t.evidence7Day.psAvoidance
          .replace("{pattern}", patternText)
          .replace("{bookCall}", bookCallLink);
      }
      // Check for people-pleasing/conflict avoidance
      else if (
        patternLower.includes("people-pleasing") ||
        patternLower.includes("conflict") ||
        patternLower.includes("people please") ||
        patternLower.includes("saying yes")
      ) {
        personalizedPS = t.evidence7Day.psPeoplePleasing
          .replace("{pattern}", patternText)
          .replace("{bookCall}", bookCallLink);
      }
      // Generic fallback
      else {
        personalizedPS = t.evidence7Day.psGeneric.replace(
          "{bookCall}",
          bookCallLink
        );
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: t.evidence7Day.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>${firstName},</strong><br><br>
              ${t.evidence7Day.greeting}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.itDoesnt}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.itShowsUp}
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">${t.evidence7Day.oneConversation}</li>
              <li style="margin-bottom: 8px;">${t.evidence7Day.oneEvening.replace("{action}", planData?.pattern_analysis?.anchor_habit || (language === "es" ? "acción" : "action")).replace("{escape}", planData?.pattern_analysis?.anchor_habit || (language === "es" ? "tu patrón de escape habitual" : "your usual escape pattern"))}</li>
              <li style="margin-bottom: 8px;">${t.evidence7Day.oneMoment}</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.notSmallWins}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.theCatch}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.inKitchen}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.butInLife}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.heresAssignment}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.whatsOneThing}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.thatsEvidence}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.dontDismiss}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.becauseWarriors}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.evidence7Day.yourWarrior}<br>
              ${t.evidence7Day.chefSteve}<br>
              ${t.evidence7Day.founderCoach}<br>
              ${t.evidence7Day.company}<br>
              <a href="mailto:${t.evidence7Day.email}" style="color: #7ED321; text-decoration: underline;">${t.evidence7Day.email}</a><br>
              ${t.evidence7Day.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.evidence7Day.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.patternRecognition.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Evidence 7-day email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send evidence 7-day email:", error);
    throw error;
  }
}

// Email 4: Integration Threshold (14 days)

export async function sendIntegrationThresholdEmail(
  email: string,
  userName: string,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending integration threshold email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

    // Get translations
    const t = emailTranslations[language];

    // Generate personalized P.S. based on stated goals (Email 4 P.S. variations)
    let personalizedPS = "";
    if (planData) {
      const purposeDomain = planData.domain_breakdown?.purpose;
      const purposeText =
        purposeDomain?.growth_edge || purposeDomain?.current_state || "";
      const purposeLower = purposeText.toLowerCase();

      // Check for business/income goal
      if (
        purposeLower.includes("business") ||
        purposeLower.includes("financial") ||
        purposeLower.includes("career") ||
        purposeLower.includes("money") ||
        purposeLower.includes("income") ||
        purposeLower.includes("revenue")
      ) {
        personalizedPS = `You're building toward ${purposeText || "something meaningful"}. In a Chef Clarity Call, we map how your nervous system patterns are affecting your business momentum—and what to shift first. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-15" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for relationship goal
      else if (
        purposeLower.includes("relationship") ||
        purposeLower.includes("partner") ||
        purposeLower.includes("family") ||
        purposeLower.includes("connection") ||
        purposeLower.includes("intimacy")
      ) {
        personalizedPS = `You want ${purposeText || "better relationships"}. In a Chef Clarity Call, we identify how your protective patterns show up in intimacy—and practice new responses. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-15" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for body/health goal
      else if (
        purposeLower.includes("body") ||
        purposeLower.includes("health") ||
        purposeLower.includes("physical") ||
        purposeLower.includes("exercise")
      ) {
        personalizedPS = `You described wanting ${purposeText || "better health"}. In a Chef Clarity Call, we rebuild your relationship with your body without punishment or force. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-15" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Generic fallback
      else {
        personalizedPS = t.integrationThreshold.psGeneric.replace(
          "{bookCall}",
          t.integrationThreshold.bookCall
        );
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: t.integrationThreshold.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>${firstName},</strong><br><br>
              ${t.integrationThreshold.thisIsWhere}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.notBecause}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.notBecauseFailed}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.butBecause}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.youveDoneHardest}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.butUnderstanding}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.thisIsWhereMost}
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">${t.integrationThreshold.readingMoreBooks}</li>
              <li style="margin-bottom: 8px;">${t.integrationThreshold.takingMoreCourses}</li>
              <li style="margin-bottom: 8px;">${t.integrationThreshold.collectingMoreFrameworks}</li>
            </ul>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.allWhileLife}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.heresWhatShifts}
            </p>
            
            <ol style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">${t.integrationThreshold.dailyMicroPractices}</li>
              <li style="margin-bottom: 8px;">${t.integrationThreshold.environmentalDesign}</li>
              <li style="margin-bottom: 8px;">${t.integrationThreshold.accountabilityStructure}</li>
            </ol>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.youveProven.replace("{proof}", planData?.pattern_analysis?.proof_with_context ? (language === "es" ? "algo significativo" : "something meaningful") : language === "es" ? "tu carrera" : "your career")}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.orAreYouGoing}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.cornerTheyWont}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.youAlreadyKnow.replace("{pattern}", (planData?.pattern_analysis?.pattern_exact_words || planData?.pattern_analysis?.what_it_costs || (language === "es" ? "sabes lo que necesita cambiar" : "you know what needs to change")).replace(/\.$/, ""))}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.theQuestionIsReady}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.integrationThreshold.yourWarrior}<br>
              ${t.integrationThreshold.chefSteve}<br>
              ${t.integrationThreshold.founderCoach}<br>
              ${t.integrationThreshold.company}<br>
              <a href="mailto:${t.integrationThreshold.email}" style="color: #7ED321; text-decoration: underline;">${t.integrationThreshold.email}</a><br>
              ${t.integrationThreshold.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.integrationThreshold.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.integrationThreshold.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Integration threshold email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send integration threshold email:", error);
    throw error;
  }
}

// Email 5: Compound Effect (21 days)

export async function sendCompoundEffectEmail(
  email: string,
  userName: string,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending compound effect email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Get translations
    const t = emailTranslations[language];
    const bookCallLink = t.compoundEffect.bookCall;

    // Generate personalized P.S. based on 30-day protocol
    let personalizedPS = "";
    if (planData) {
      const protocol = planData.thirty_day_protocol;
      if (protocol?.specific_action) {
        personalizedPS = `You committed to ${protocol.specific_action}. Whether you did it once or daily, that's data. In a Discovery Call, we use that data to design what's actually sustainable for your kitchen energy. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-15" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      } else if (protocol?.immediate_practice) {
        personalizedPS = `You planned ${protocol.immediate_practice}. In a Discovery Call, we figure out why it stuck or why it didn't—and adjust from there. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-15" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      } else {
        personalizedPS = t.compoundEffect.psGeneric.replace(
          "{bookCall}",
          bookCallLink
        );
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: t.compoundEffect.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>${userName},</strong><br><br>
              ${t.compoundEffect.greeting}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.heresWhatNoticed}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.theOnesWhoTransform}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.theyJustNotice}
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">${t.compoundEffect.spiralStillShows}</li>
              <li style="margin-bottom: 8px;">${t.compoundEffect.escapePatternStill}</li>
              <li style="margin-bottom: 8px;">${t.compoundEffect.oldStoryStill}</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.thatsNotSmall}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.butHeresCatch}
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.notBecauseNothing}
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.whichIsExactly}
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.youveAlreadyProven}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.compoundEffect.yourWarrior}<br>
              ${t.compoundEffect.chefSteve}<br>
              ${t.compoundEffect.founderCoach}<br>
              ${t.compoundEffect.company}<br>
              <a href="mailto:${t.compoundEffect.email}" style="color: #7ED321; text-decoration: underline;">${t.compoundEffect.email}</a><br>
              ${t.compoundEffect.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.compoundEffect.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.compoundEffect.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Compound effect email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send compound effect email:", error);
    throw error;
  }
}

// Email 6: Direct Invitation (30 days)

export async function sendDirectInvitationEmail(
  email: string,
  userName: string,
  planData?: PlanData,
  language: Language = "en"
) {
  console.log("Sending direct invitation email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Get translations
    const t = emailTranslations[language];
    const bookCallLink = t.directInvitation.bookCall;

    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

    // Generate personalized P.S. based on future vision (Email 5 P.S. variations)
    let personalizedPS = "";
    if (planData) {
      const purposeDomain = planData.domain_breakdown?.purpose;
      const futureVision =
        purposeDomain?.growth_edge || purposeDomain?.current_state || "";

      // Check if future vision exists
      if (futureVision && futureVision.length > 10) {
        personalizedPS = `You described a Tuesday where, ${futureVision}. That version of you exists—you just need the path to get there. Which path are you choosing today?`;
      } else {
        personalizedPS = t.directInvitation.psGeneric.replace(
          "{bookCall}",
          bookCallLink
        );
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: t.directInvitation.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F5F3ED;">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F3ED; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Container -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="Wydaho Warrior Knife Check Assessment Logo" style="height: 150px; width: auto;" />
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Accent Line -->
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <div style="height: 3px; background-color: #C9A875; width: 200px; margin: 0 auto;"></div>
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="40"></td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 0 40px;">
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>${firstName},</strong><br><br>
              ${t.directInvitation.greeting}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.imNotGoingToAsk}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.insteadImAsking}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.maybeYou}
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">${t.directInvitation.caughtYourselfMid}</li>
              <li style="margin-bottom: 8px;">${t.directInvitation.hadHardConversation}</li>
              <li style="margin-bottom: 8px;">${t.directInvitation.choseAction.replace("{action}", planData?.pattern_analysis?.anchor_habit || (language === "es" ? "acción" : "action")).replace("{escape}", planData?.pattern_analysis?.anchor_habit || (language === "es" ? "[comportamiento de escape]" : "[escape behavior]"))}</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.ifYouCanName}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.ifNothingsDifferent}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.eitherWayHeresWhat}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.awarenessPlusStructure}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.youHaveAwareness}
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.theQuestionIsNext}
            </p>
            
            <p style="font-size: 20px; color: #3D4D2E; margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
              ${t.directInvitation.heresWhatsNext}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.youveGotThreePaths}
            </p>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                ${t.directInvitation.path1Title}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 10px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 600;">
                ${t.directInvitation.path1Subtitle}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path1Description}
              </p>
              <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 15px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
                <li style="margin-bottom: 8px;">${t.directInvitation.path1Bullet1}</li>
                <li style="margin-bottom: 8px;">${t.directInvitation.path1Bullet2}</li>
                <li style="margin-bottom: 8px;">${t.directInvitation.path1Bullet3}</li>
              </ul>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path1ThisIs}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path1BestTool}
              </p>
              <p style="font-size: 16px; color: #666; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path1PaymentPlan}
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://app.paperbell.com/checkout/packages/156555" style="background-color: #7ED321; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  ${t.directInvitation.path1Button}
                </a>
              </div>
            </div>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                ${t.directInvitation.path2Title}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 10px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 600;">
                ${t.directInvitation.path2Subtitle}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path2Description}
              </p>
              <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 15px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
                <li style="margin-bottom: 8px;">${t.directInvitation.path2Bullet1}</li>
                <li style="margin-bottom: 8px;">${t.directInvitation.path2Bullet2}</li>
                <li style="margin-bottom: 8px;">${t.directInvitation.path2Bullet3}</li>
              </ul>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path2ThisIs}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path2YouveBeen}
              </p>
              <p style="font-size: 16px; color: #666; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path2PaymentPlan}
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://app.paperbell.com/checkout/packages/186881" style="background-color: #7ED321; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  ${t.directInvitation.path2Button}
                </a>
              </div>
            </div>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                ${t.directInvitation.path3Title}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path3StayConnected}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path3Sometimes}
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path3Subscribe}<br>
                ${t.directInvitation.path3SubscribeDesc}
              </p>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://wydahowarriors.com/newsletter" style="background-color: #C9A875; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif; margin-right: 10px;">
                  ${t.directInvitation.path3SubscribeButton}
                </a>
              </div>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                ${t.directInvitation.path3Follow}<br>
                ${t.directInvitation.path3FollowDesc}
              </p>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://www.youtube.com/@Wydaho-Warriors" style="background-color: #C9A875; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  ${t.directInvitation.path3FollowButton}
                </a>
              </div>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                When the gap between who you are and who you want to be gets uncomfortable enough to act on, you'll know where to find me.
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Keep the assessment. It's not going anywhere. And neither am I.
              </p>
            </div>
            
            <p style="font-size: 20px; color: #3D4D2E; margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
              CORNER—ONE LAST THING:
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              In January 2024, I disappeared. Not because I was weak. Because I thought I was supposed to handle everything alone.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              I was wrong.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Strength isn't grinding through pain. Strength is asking for help before you break.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You've had the map for 30 days. The question is: Are you ready to build the path?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Whether that's 5 weeks, 13 weeks, or just staying connected until you're ready—the choice is yours.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              But here's what I know for sure: The sharpest tool in your kitchen is YOU.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              And even the best blade needs sharpening.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Every second counts, chef. What are you going to do with yours?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              ${t.directInvitation.yourWarrior}<br>
              ${t.directInvitation.chefSteve}<br>
              ${t.directInvitation.founderCoach}<br>
              ${t.directInvitation.company}<br>
              <a href="mailto:${t.directInvitation.email}" style="color: #7ED321; text-decoration: underline;">${t.directInvitation.email}</a><br>
              ${t.directInvitation.phone}
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              ${t.directInvitation.bibleVerse}
            </p>
            
            ${
              personalizedPS
                ? `
            <p style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 30px 0; font-family: 'Inter', sans-serif; font-weight: 400;">
                <strong>P.S.</strong> ${personalizedPS}
              </p>

            `
                : ""
            }
                                </td>
                            </tr>
                            
                            <!-- Spacer -->
                            <tr>
                                <td height="60"></td>
                            </tr>
                            
                        </table>
          
                        <!-- Footer -->
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container">
                            <tr>
                                <td height="30"></td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 0 40px;">
                                    <p style="color: #666; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">
                                        ${t.directInvitation.needSupport} <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td height="30"></td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log("Direct invitation email sent successfully:", data?.id);
  } catch (error) {
    console.error("Failed to send direct invitation email:", error);
    throw error;
  }
}
