"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import ConsentScreen from "@/components/ConsentScreen";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssessmentPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: { token?: string };
}

export default function AssessmentPage({
  params,
  searchParams,
}: AssessmentPageProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [hasConsented, setHasConsented] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const router = useRouter();
  const { t, setLanguage } = useLanguage();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.sessionId);

      // First, check cookie/localStorage for language preference (most reliable)
      // This is set when user selects language on landing page
      const { getLanguageFromRequest } = await import("@/lib/i18n");
      const clientLanguage = getLanguageFromRequest();

      // Fetch session language from database
      try {
        const sessionResponse = await fetch(
          `/api/session/${resolvedParams.sessionId}/language`
        );
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          const sessionLang =
            sessionData.language &&
            (sessionData.language === "en" || sessionData.language === "es")
              ? sessionData.language
              : null;

          // Use client language if available, otherwise use session language, otherwise default to 'en'
          const finalLanguage = clientLanguage || sessionLang || "en";

          console.log("=== LANGUAGE DETECTION ===");
          console.log("Client language (cookie/localStorage):", clientLanguage);
          console.log("Session language (DB):", sessionLang);
          console.log("Final language:", finalLanguage);
          console.log("==========================");

          // Set language in context
          setLanguage(finalLanguage);

          // If client language differs from session language, update session
          if (clientLanguage && clientLanguage !== sessionLang) {
            console.log("Updating session language to:", clientLanguage);
            try {
              const updateResponse = await fetch(
                "/api/session/update-language",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sessionId: resolvedParams.sessionId,
                    language: clientLanguage,
                  }),
                }
              );
              if (updateResponse.ok) {
                console.log("Session language updated successfully");
              }
            } catch (updateError) {
              console.error("Failed to update session language:", updateError);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch session language:", error);
        // Fallback to client language or default
        if (clientLanguage) {
          setLanguage(clientLanguage);
        }
      }
    };
    getParams();
  }, [params, setLanguage]);

  useEffect(() => {
    let isMounted = true;
    async function validate() {
      if (!searchParams.token) {
        if (isMounted) setIsValid(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/jwt?token=${encodeURIComponent(searchParams.token)}`
        );
        if (!res.ok) {
          if (isMounted) setIsValid(false);
          return;
        }
        const data = await res.json();
        if (isMounted) {
          const valid = data.valid === true && data.sessionId === sessionId;
          setIsValid(valid);
          if (valid && data.completed === true) {
            setIsComplete(true);
          }
        }
      } catch (e) {
        console.error("Token validation failed:", e);
        if (isMounted) setIsValid(false);
      }
    }
    if (sessionId) {
      validate();
    }
    return () => {
      isMounted = false;
    };
  }, [searchParams.token, sessionId]);

  const handleComplete = useCallback(async () => {
    // Trigger report generation and redirect to report page
    try {
      console.log("Starting report generation...");
      console.log("SessionId being sent:", sessionId);

      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("Report generation completed successfully:", result);
        console.log("Redirecting to report page...");
        // Redirect to report page after successful generation
        router.push(`/api/report/${sessionId}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to trigger report generation:", errorData);
        console.log("Redirecting to report page despite error...");
        // Redirect to report page even on error - report might still be generated
        router.push(`/api/report/${sessionId}`);
      }
    } catch (error) {
      console.error("Error triggering report generation:", error);
      console.log("Redirecting to report page despite catch error...");
      // Redirect to report page even on catch error - report might still be generated
      router.push(`/api/report/${sessionId}`);
    }
  }, [sessionId, router]);

  if (isValid === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <div className="text-center max-w-md w-full">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#4A5D23", borderTopColor: "transparent" }}
          ></div>
          <h1
            className="text-lg sm:text-xl font-semibold"
            style={{ color: "#1A1A1A" }}
          >
            {t.assessment.validating}
          </h1>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <div className="text-center max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{
              color: "#4A5D23",
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            {t.assessment.accessDenied}
          </h1>
          <p className="mb-6 text-sm sm:text-base" style={{ color: "#1A1A1A" }}>
            {t.assessment.invalidLink}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base hover:opacity-90"
            style={{ backgroundColor: "#4A5D23" }}
          >
            {t.assessment.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!hasConsented) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <div className="max-w-2xl w-full">
          <ConsentScreen onConsent={() => setHasConsented(true)} />
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <div className="text-center max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{
              color: "#4A5D23",
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            {t.assessment.complete}
          </h1>
          <p className="mb-6 text-sm sm:text-base" style={{ color: "#1A1A1A" }}>
            {t.assessment.reportSent}
          </p>
          <div
            className="rounded-md p-4"
            style={{ backgroundColor: "#FFF3CD", border: "1px solid #D4AF37" }}
          >
            <p className="text-sm" style={{ color: "#856404" }}>
              {t.assessment.checkEmail}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>
      <ChatInterface sessionId={sessionId} onComplete={handleComplete} />
    </div>
  );
}
