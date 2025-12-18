import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { PlanData } from "./pdf";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend requires the "from" domain to be verified.
// Use env overrides so production can change domains without code edits.
const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "WW Knife Check Assessment <noreply@wwassessment.com>";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "info@wwassessment.com";

export async function sendMagicLink(
  email: string,
  sessionId: string,
  firstName?: string
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

  try {
    console.log("Sending email via Resend...");
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: "Your WW Knife Check Assessment Is Ready",
      html: `
        <!DOCTYPE html>

        <html lang="en">
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your WW Knife Check Assessment Is Ready</title>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
                                        Your assessment is ready.
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
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/assessment/${sessionId}?token=${jwt.sign({ sessionId, email }, process.env.JWT_SECRET!, { expiresIn: "7d" })}" class="cta-button" style="display: inline-block; background: #7ED321; color: #FFFFFF; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 600; letter-spacing: 0.3px; transition: background 0.2s ease; font-family: 'Inter', -apple-system, sans-serif;">
                                        Begin Your Assessment →
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
                                        Takes 15 minutes. No rush.<br>
                                        Find a quiet space where you can be honest.
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
                                        Questions? Just reply to this email.<br>
                                        We're here to help.
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
  planData?: PlanData
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

    // Extract pull quote and 72-hour action from planData
    const pullQuote = planData?.pull_quote || "";
    const seventyTwoAction =
      planData?.roadmap_briefs?.seventy_two_brief ||
      planData?.thirty_day_protocol?.immediate_practice ||
      "Take the first step from your assessment";

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
        personalizedPS = `You mentioned "${patternText}". If you want help designing the environment and structure that makes change automatic instead of exhausting, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
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
        personalizedPS = `You're building toward ${goalText}. If you want to map out how your patterns are affecting your momentum, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
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
        personalizedPS = `You shared that ${relationshipText}. If you want to understand how your protective patterns show up in your closest relationships, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
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
        personalizedPS = `You described your relationship with your craft as ${bodyText}. If you want to rebuild that connection without force or punishment, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
      }
      // Fallback for general transformation goals
      else if (thirtyDayProtocol?.immediate_practice) {
        const goalText = thirtyDayProtocol.immediate_practice;
        personalizedPS = `You're building toward ${goalText}. If you want to map out how your patterns are affecting your momentum, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
      }
      // Final fallback
      else {
        personalizedPS = `Your assessment revealed important patterns. If you want to understand how these patterns are affecting your progress, <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">book a call</a>.`;
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

      subject: "Your Chef Tool Box Assessment - Here's What's Burning",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              Your complete Chef Tool Box Assessment is attached.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              Before you read it, corner for a second:
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              Everything in that report—every pattern, every protective mechanism, every stuck point—made perfect sense at the time it formed. Your nervous system has been doing exactly what it was designed to do: keep you safe.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              The question now is: Are those same strategies still serving you, or is it time to update them?
            </p>
            
            ${
              pullQuote
                ? `
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              You said "${pullQuote}". That's not weakness talking. That's honesty. And honesty is the first step out of the weeds.
            </p>
            `
                : ""
            }

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              Read the report when you're ready. Then take the 72-hour action.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              This isn't about fixing you. You're not broken. You're burnt. There's a difference.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              <strong>Your 72-Hour Action:</strong> ${seventyTwoAction}
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              Why 72 hours? Because awareness fades fast. And this moment—where you can see the pattern clearly—is when change actually happens.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400;">
              Every second counts, chef.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Steve Murphy<br>
              Culinary Institute of America<br>
              Former Missing Person, Current Warrior<br>
              Wydaho Warriors LLC<br>
              <a href="mailto:steve@wydahowarriors.com" style="color: #7ED321; text-decoration: underline;">steve@wydahowarriors.com</a><br>
              208-227-3729
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              "Come to me, all who are weary and burdened, and I will give you rest." — Matthew 11:28
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
                Your personalized protocol is attached as a PDF file
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
  planData?: PlanData
) {
  console.log("Sending pattern recognition email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

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
        personalizedPS =
          'In a Chef Clarity Call, we map the exact moments your nervous system shifts into protection mode—and build specific interrupts that work with your wiring, not against it. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a> when you\'re ready.';
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
        personalizedPS =
          'In a Chef Clarity Call, we identify what safety looks like for your nervous system—so action doesn\'t require forcing yourself through shutdown. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a> when you\'re ready.';
      }
      // Check for stress regression
      else if (
        combined.includes("regression") ||
        combined.includes("ventral") ||
        combined.includes("regulation")
      ) {
        personalizedPS =
          'In a Chef Clarity Call, we design practices that help you stay regulated under pressure—not just when life is calm. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a> when you\'re ready.';
      }
      // Generic fallback
      else {
        personalizedPS =
          'In a Chef Clarity Call, we design pattern interrupts tailored to your nervous system. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a> when you\'re ready to build new responses.';
      }
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: "You probably already caught yourself doing it",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              I'm curious—since reading your assessment, have you caught yourself doing exactly the thing it described?
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Maybe you had clarity about your next move, then immediately started researching "the right way" to do it instead of just starting.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Or you felt motivated to ${planData?.pattern_analysis?.pattern_exact_words || planData?.pattern_analysis?.anchor_habit || "take action"}, then reached for ${planData?.pattern_analysis?.anchor_habit || "your usual escape pattern"} instead.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              That's not failure. That's your nervous system doing what it's been trained to do.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              The difference now? <strong>You see it happening in real time.</strong>
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              And that awareness gap—the space between the trigger and your automatic response—is where all change begins.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              In the kitchen, you can predict when a station is about to go down before it happens. You see the signs: tickets backing up, timing off, prep running low.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Your life works the same way. You're starting to see the signs before the crash.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              That's not small progress. That's warrior-level awareness.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              The question is: Are you willing to do something about it, or are you going to keep watching the crash happen?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Steve Murphy<br>
              Wydaho Warriors<br>
              <a href="mailto:steve@wydahowarriors.com" style="color: #7ED321; text-decoration: underline;">steve@wydahowarriors.com</a><br>
              208-227-3729
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." — Joshua 1:9
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
  planData?: PlanData
) {
  console.log("Sending evidence 7-day email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

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
        personalizedPS = `You mentioned "${patternText}". In a Chef Clarity Call, we identify what 'good enough' actually looks like for your nervous system—so you can ship without the spiral. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for avoidance/procrastination
      else if (
        patternLower.includes("avoidance") ||
        patternLower.includes("procrastination") ||
        patternLower.includes("avoid") ||
        patternLower.includes("delay")
      ) {
        personalizedPS = `You shared that "${patternText}". In a Chef Clarity Call, we build momentum systems that work with your energy cycles instead of fighting them. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for people-pleasing/conflict avoidance
      else if (
        patternLower.includes("people-pleasing") ||
        patternLower.includes("conflict") ||
        patternLower.includes("people please") ||
        patternLower.includes("saying yes")
      ) {
        personalizedPS = `You described "${patternText}". In a Chef Clarity Call, we practice saying what's true without triggering your abandonment alarm. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Generic fallback
      else {
        personalizedPS =
          'The assessment mapped the patterns. A Chef Clarity Call helps you see progress you\'re missing and builds momentum structures. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.';
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],

      subject: "The shift you might not be noticing",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              Most burnt-out chefs wait for transformation to feel like a lightning bolt.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              It doesn't.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              It shows up as:
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">One conversation you didn't avoid</li>
              <li style="margin-bottom: 8px;">One evening you chose ${planData?.pattern_analysis?.anchor_habit ? `[positive behavior]` : "action"} over ${planData?.pattern_analysis?.anchor_habit || "your usual escape pattern"}</li>
              <li style="margin-bottom: 8px;">One moment you caught the spiral before it hijacked your whole day</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              These aren't "small" wins. They're proof your nervous system is recalibrating.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              The catch? Your brain is so focused on what you haven't done yet that it completely misses what's already shifting.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              In the kitchen, you wouldn't miss a perfectly executed dish just because the rest of service was chaos. But in life? You're ignoring every win because it doesn't feel "big enough" yet.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Here's your assignment:
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              What's one thing you've done in the last week that your former self—the one who took this assessment—would have avoided or numbed out from?
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              That's the evidence that you're already changing.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Don't dismiss it. Don't minimize it. Acknowledge the win.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Because warriors build momentum on proof, not perfection.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Steve Murphy<br>
              Wydaho Warriors<br>
              <a href="mailto:steve@wydahowarriors.com" style="color: #7ED321; text-decoration: underline;">steve@wydahowarriors.com</a><br>
              208-227-3729
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              "I can do all things through Christ who strengthens me." — Philippians 4:13
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
  planData?: PlanData
) {
  console.log("Sending integration threshold email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Extract first name
    const firstName =
      userName?.split(" ")[0] || email.split("@")[0].split(".")[0];

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
        personalizedPS = `You're building toward ${purposeText || "something meaningful"}. In a Chef Clarity Call, we map how your nervous system patterns are affecting your business momentum—and what to shift first. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for relationship goal
      else if (
        purposeLower.includes("relationship") ||
        purposeLower.includes("partner") ||
        purposeLower.includes("family") ||
        purposeLower.includes("connection") ||
        purposeLower.includes("intimacy")
      ) {
        personalizedPS = `You want ${purposeText || "better relationships"}. In a Chef Clarity Call, we identify how your protective patterns show up in intimacy—and practice new responses. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Check for body/health goal
      else if (
        purposeLower.includes("body") ||
        purposeLower.includes("health") ||
        purposeLower.includes("physical") ||
        purposeLower.includes("exercise")
      ) {
        personalizedPS = `You described wanting ${purposeText || "better health"}. In a Chef Clarity Call, we rebuild your relationship with your body without punishment or force. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      }
      // Generic fallback
      else {
        personalizedPS =
          'A Chef Clarity Call clarifies whether you\'re ready for implementation or still gathering insights. Both are valid—but knowing saves months. <a href="https://paperbell.me/wydaho-warriors/chef-clarity-call" style="color: #7ED321; text-decoration: underline;">Book here</a>.';
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "This is where most chefs quit",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              Two weeks is when most chefs quit.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Not because they failed. Not because the assessment was wrong.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              But because <strong>awareness without structure = temporary inspiration.</strong>
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You've done the hardest part—you've seen the pattern clearly. You understand why you've been stuck.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              But understanding doesn't rewire your nervous system. Consistent, appropriately-sized practice does.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              This is where most chefs stay in the "knowing" phase forever:
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">Reading more books</li>
              <li style="margin-bottom: 8px;">Taking more courses</li>
              <li style="margin-bottom: 8px;">Collecting more frameworks</li>
            </ul>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              All while their actual life stays the same.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Here's what shifts chefs from knowing to embodying:
            </p>
            
            <ol style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;"><strong>Daily micro-practices</strong> that build new neural pathways (not willpower marathons)</li>
              <li style="margin-bottom: 8px;"><strong>Environmental design</strong> that removes friction (not forcing yourself to "be disciplined")</li>
              <li style="margin-bottom: 8px;"><strong>Accountability structure</strong> that prevents regression when life gets hard</li>
            </ol>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You've proven you can do hard things—you built ${planData?.pattern_analysis?.proof_with_context ? `something meaningful` : "your career"}. The question is: Are you ready to apply that same capability to your own nervous system?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Or are you going to keep grinding through the same patterns, hoping they magically change on their own?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Corner: they won't.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You already know what needs to change. You said it yourself: ${planData?.pattern_analysis?.pattern_exact_words || planData?.pattern_analysis?.what_it_costs || "you know what needs to change"}.
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              The question is: Are you finally ready to act on it?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Steve Murphy<br>
              Wydaho Warriors<br>
              <a href="mailto:steve@wydahowarriors.com" style="color: #7ED321; text-decoration: underline;">steve@wydahowarriors.com</a><br>
              208-227-3729
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!" — 2 Corinthians 5:17
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
  planData?: PlanData
) {
  console.log("Sending compound effect email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
    // Generate personalized P.S. based on 30-day protocol

    let personalizedPS = "";
    if (planData) {
      const protocol = planData.thirty_day_protocol;
      if (protocol?.specific_action) {
        personalizedPS = `You committed to ${protocol.specific_action}. Whether you did it once or daily, that's data. In a Discovery Call, we use that data to design what's actually sustainable for your kitchen energy. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      } else if (protocol?.immediate_practice) {
        personalizedPS = `You planned ${protocol.immediate_practice}. In a Discovery Call, we figure out why it stuck or why it didn't—and adjust from there. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">Book here</a>.`;
      } else {
        personalizedPS =
          'Three weeks of data is enough to see your patterns clearly. In a Discovery Call, we turn that data into a sustainable system. <a href="https://app.paperbell.com/checkout/bookings/new?package_id=156554&tab=2025-12-29" style="color: #7ED321; text-decoration: underline;">Book here</a>.';
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Three weeks in—this is where it gets real",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              Three weeks is the threshold where temporary motivation either becomes sustainable practice or fades completely.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Here's what I've noticed working with 680+ people:
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>The ones who transform don't feel dramatically different at 21 days.</strong>
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              They just notice they're recovering faster:
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">The spiral still shows up, but it doesn't hijack their whole week</li>
              <li style="margin-bottom: 8px;">The escape pattern still tempts them, but they catch it before autopilot takes over</li>
              <li style="margin-bottom: 8px;">The old story still plays, but they recognize it as a story instead of truth</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              That's not small progress. That's your nervous system learning a new default.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
               But here's the catch: <strong>This is exactly when most people quit.</strong>
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Not because nothing's working—but because the initial insight has worn off and the daily practice feels boring. Unsexy. Repetitive.
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Which is exactly what rewiring your nervous system requires.
            </p>


            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You've already proven you can do this—you showed up for the assessment, you read the report, you've been noticing your patterns. The question is: Are you willing to keep going through the unsexy middle where nothing feels dramatic but everything is shifting?
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 30px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Your Teammate,<br>

              <strong style="color: #C9A875;">Matthew</strong>
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
  planData?: PlanData
) {
  console.log("Sending direct invitation email to:", email);

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  try {
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
        personalizedPS = `You described a Tuesday where ${futureVision}. That version of you exists—you just need the path to get there. Which path are you choosing today?`;
      } else {
        personalizedPS =
          "You've had the map for 30 days. Ready to build the path? Choose your starting point above.";
      }
    }
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "30 days later—what's actually different?",
      html: `
        <!DOCTYPE html>
        <html>
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
                                    <img src="${process.env.NEXT_PUBLIC_APP_URL}/WW_logo.png" alt="WW Knife Check Assessment Logo" style="height: 150px; width: auto;" />
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
              It's been a month since you took your Chef Tool Box Assessment.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              I'm not going to ask if you "implemented everything" or if you're "where you want to be." That's not how transformation works.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Instead, I'm asking: <strong>What's one thing that's different—even slightly—compared to 30 days ago?</strong>
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Maybe you:
            </p>
            
            <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 20px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
              <li style="margin-bottom: 8px;">Caught yourself mid-spiral and interrupted it (even once)</li>
              <li style="margin-bottom: 8px;">Had a hard conversation you would have avoided before</li>
              <li style="margin-bottom: 8px;">Chose ${planData?.pattern_analysis?.anchor_habit ? `[positive behavior]` : "action"} when you normally would have reached for ${planData?.pattern_analysis?.anchor_habit || "[escape behavior]"}</li>
            </ul>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              If you can name even one shift, that's proof the assessment was accurate and you're capable of change.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              If nothing's different? That's also useful information—it means you're in the "knowing" phase but haven't moved to the "doing" phase yet.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              Either way, here's what I know after helping 680+ people:
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <strong>Awareness + Structure + Accountability = Lasting Change</strong>
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You have the awareness. The assessment gave you that.
            </p>
            

            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              The question is: What's your next move?
            </p>
            
            <p style="font-size: 20px; color: #3D4D2E; margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
              HERE'S WHAT'S NEXT:
            </p>
            
            <p style="font-size: 18px; color: #1A1A1A; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
              You've got three paths forward. Choose the one that fits where you actually are—not where you think you "should" be.
            </p>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                PATH 1: YOU'RE READY TO SHARPEN THE BLADE 🔥
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 10px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 600;">
                5-Week Chef Warrior Coaching - $895
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                For chefs who need momentum NOW. One focused month to:
              </p>
              <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 15px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
                <li style="margin-bottom: 8px;">Identify your core pattern and build interrupts that actually work</li>
                <li style="margin-bottom: 8px;">Design your environment so the default choice is the right choice</li>
                <li style="margin-bottom: 8px;">Practice new responses in real scenarios (not theory)</li>
              </ul>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                This is the unfair advantage. One month. Real change.
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                The best tool in your kitchen is YOU. But even the best blade needs sharpening.
              </p>
              <p style="font-size: 16px; color: #666; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Payment plan available.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://paperbell.me/wydaho-warriors/5-week-coaching" style="background-color: #7ED321; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  Start 5-Week Coaching - $895
                </a>
              </div>
            </div>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                PATH 2: YOU'RE READY TO REBUILD THE FOUNDATION ⚔️
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 10px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 600;">
                13-Week Chef Warrior Coaching - $1,995
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                For chefs who want deep, lasting transformation. Three months to:
              </p>
              <ul style="color: #1A1A1A; font-size: 18px; line-height: 1.6; margin: 15px 0; padding-left: 20px; font-family: 'Inter', sans-serif;">
                <li style="margin-bottom: 8px;">Rewire your nervous system patterns (not just manage symptoms)</li>
                <li style="margin-bottom: 8px;">Rebuild Spiritual. Emotional. Mental. Physical. from the ground up</li>
                <li style="margin-bottom: 8px;">Create sustainable structures that prevent regression when life gets hard</li>
              </ul>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                This is the complete rebuild. Mind. Body. Spirit.
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                You've been grinding the blade down for years. Time to reforge it from the foundation.
              </p>
              <p style="font-size: 16px; color: #666; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Payment plan available.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://paperbell.me/wydaho-warriors/13-week-coaching" style="background-color: #7ED321; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  Start 13-Week Coaching - $1,995
                </a>
              </div>
            </div>
            
            <div style="background-color: #F5F3ED; padding: 30px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 20px; color: #3D4D2E; margin: 0 0 15px 0; line-height: 1.6; font-family: 'Playfair Display', serif; font-weight: 700;">
                PATH 3: YOU'RE NOT READY YET (AND THAT'S OKAY) 📧 🎥
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Stay Connected Until You Are
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                Sometimes the best investment is patience. If you're not ready to commit yet, stay in the loop:
              </p>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                📧 <strong>Subscribe to the Wydaho Warriors Newsletter:</strong><br>
                Weekly raw truth, practical tools, and warrior encouragement straight to your inbox. No fluff. Just truth.
              </p>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://wydahowarriors.com/newsletter" style="background-color: #C9A875; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif; margin-right: 10px;">
                  Subscribe to Newsletter
                </a>
              </div>
              <p style="font-size: 18px; color: #1A1A1A; margin: 15px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">
                🎥 <strong>Follow on YouTube:</strong><br>
                Weekly videos on burnout, boundaries, faith, and finding your fire again. Real stories. Real solutions.
              </p>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://youtube.com/@wydahowarriors" style="background-color: #C9A875; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; font-family: 'Inter', sans-serif;">
                  Subscribe to YouTube Channel
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
              Steve Murphy<br>
              Culinary Institute of America<br>
              Former Missing Person, Current Warrior<br>
              Wydaho Warriors LLC<br>
              <a href="mailto:steve@wydahowarriors.com" style="color: #7ED321; text-decoration: underline;">steve@wydahowarriors.com</a><br>
              208-227-3729
            </p>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0; line-height: 1.6; font-family: 'Inter', sans-serif; font-style: italic;">
              "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11
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
                                        Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #C9A875; text-decoration: underline;">${SUPPORT_EMAIL}</a>
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
