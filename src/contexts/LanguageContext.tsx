"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  getTranslations,
  getLanguageFromRequest,
  setLanguagePreference,
} from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslations>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Initialize language from request
    // Returns null if not found, so default to 'en' for UI display
    const detectedLang = getLanguageFromRequest();
    setLanguageState(detectedLang || 'en');
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguagePreference(lang);

    // Update URL param if on client
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
