"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";

export default function SuccessPage() {
  const [userEmail, setUserEmail] = useState("your email.");
  const [isLoading, setIsLoading] = useState(true);
  const { t, setLanguage } = useLanguage();

  useEffect(() => {
    // Set language from URL param if available, otherwise use session language
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    if (langParam && (langParam === 'en' || langParam === 'es')) {
      setLanguage(langParam);
    }
    
    fetchLatestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const fetchLatestSession = async (retryCount = 0) => {
    try {
      const response = await fetch("/api/latest-session");
      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
        
        // Set language from session if available and not already set from URL
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang') as Language;
        if (!langParam && data.language && (data.language === 'en' || data.language === 'es')) {
          setLanguage(data.language);
        }
        
        setIsLoading(false);
      } else {
        // If no session found and we haven't retried too many times, wait and retry
        if (retryCount < 3) {
          console.log(
            `No session found, retrying in 5 seconds... (attempt ${retryCount + 1})`
          );
          setTimeout(() => fetchLatestSession(retryCount + 1), 5000);
        } else {
          // Fallback if no session found after retries
          setUserEmail("the email you used for purchase");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching latest session:", error);
      if (retryCount < 3) {
        setTimeout(() => fetchLatestSession(retryCount + 1), 5000);
      } else {
        setUserEmail("the email you used for purchase");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F3ED" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: "#3D4D2E",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
            }}
          >
            {t.success.title}
          </h1>

          <p
            className="text-xl mb-12 max-w-2xl mx-auto"
            style={{
              color: "#1A1A1A",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            {t.success.subtitle}
          </p>

          {/* Email Confirmation */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
            <h2
              className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6"
              style={{
                color: "#3D4D2E",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {t.success.checkEmail}
            </h2>
            <div className="text-left space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base" style={{ color: "#1A1A1A" }}>
                {t.success.emailSentTo}{" "}
                <strong>
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse">
                        {t.common.loading}
                      </span>
                    </span>
                  ) : (
                    userEmail
                  )}
                </strong>
              </p>
              <div
                className="rounded-lg p-3 sm:p-4 text-xs sm:text-sm"
                style={{ backgroundColor: "#FFF3CD" }}
              >
                <p style={{ color: "#1A1A1A" }}>
                  <strong>{t.success.subjectLine}</strong> &quot;Your Wydaho Warrior Knife
                  Check Assessment Link – Ready to Begin&quot;
                </p>
                <p style={{ color: "#1A1A1A" }}>
                  <strong>{t.success.from}</strong> wwassessment.com
                </p>
              </div>
              <p className="text-xs sm:text-sm" style={{ color: "#666" }}>
                {t.success.cantFind}
              </p>
            </div>
          </div>

          {/* What Happens Next */}
          <div
            className="rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
            style={{ backgroundColor: "white" }}
          >
            <h3
              className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8"
              style={{
                color: "#3D4D2E",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {t.success.whatHappensNext}
            </h3>
            <div className="text-left space-y-4 sm:space-y-6">
              <div className="flex items-start">
                <span
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 mt-1 flex-shrink-0"
                  style={{ backgroundColor: "#3D4D2E" }}
                >
                  1
                </span>
                <div>
                  <h4
                    className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base"
                    style={{
                      color: "#3D4D2E",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {t.success.step1Title}
                  </h4>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "#1A1A1A" }}
                  >
                    {t.success.step1Text}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 mt-1 flex-shrink-0"
                  style={{ backgroundColor: "#3D4D2E" }}
                >
                  2
                </span>
                <div>
                  <h4
                    className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base"
                    style={{
                      color: "#3D4D2E",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {t.success.step2Title}
                  </h4>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "#1A1A1A" }}
                  >
                    {t.success.step2Text}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 mt-1 flex-shrink-0"
                  style={{ backgroundColor: "#3D4D2E" }}
                >
                  3
                </span>
                <div>
                  <h4
                    className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base"
                    style={{
                      color: "#3D4D2E",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {t.success.step3Title}
                  </h4>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "#1A1A1A" }}
                  >
                    {t.success.step3Text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="text-xs sm:text-sm" style={{ color: "#666" }}>
            <p>
              {t.success.needHelp}{" "}
              <a
                href="mailto:steve@wydahowarriors.com"
                className="hover:underline"
                style={{ color: "#4A5D23" }}
              >
                {t.success.contactSupport}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
