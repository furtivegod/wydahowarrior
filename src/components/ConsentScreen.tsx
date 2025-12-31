"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConsentScreenProps {
  onConsent: () => void;
}

export default function ConsentScreen({ onConsent }: ConsentScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{
            color: "#3D4D2E",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
          }}
        >
          {t.consent.welcome}
        </h1>

        <div className="space-y-6">
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{
                color: "#3D4D2E",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {t.consent.aboutTitle}
            </h2>
            <p className="leading-relaxed" style={{ color: "#1A1A1A" }}>
              {t.consent.aboutText}
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{
                color: "#3D4D2E",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {t.consent.privacyTitle}
            </h2>
            <p className="leading-relaxed" style={{ color: "#1A1A1A" }}>
              {t.consent.privacyText}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="consent"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2"
              style={{ accentColor: "#3D4D2E" }}
            />
            <label htmlFor="consent" style={{ color: "#1A1A1A" }}>
              {t.consent.agreeText}
            </label>
          </div>

          <div className="text-center">
            <button
              onClick={onConsent}
              disabled={!agreed}
              className="text-white px-8 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-90"
              style={{ backgroundColor: "#7ED321", color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              {t.consent.beginButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
