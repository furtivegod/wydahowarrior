"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n'

export default function HomePage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [selectedLang, setSelectedLang] = useState<Language | null>(null)

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang)
    setLanguage(lang)
    
    // Get the appropriate SamCart URL based on language
    const samcartUrl = lang === 'es' 
      ? process.env.NEXT_PUBLIC_SAMCART_URL_ES || process.env.NEXT_PUBLIC_SAMCART_URL
      : process.env.NEXT_PUBLIC_SAMCART_URL
    
    if (samcartUrl) {
      // Redirect to SamCart with language parameter
      const url = new URL(samcartUrl)
      url.searchParams.set('lang', lang)
      window.location.href = url.toString()
    } else {
      // Fallback to success page if no SamCart URL is configured
      router.push(`/success?lang=${lang}`)
    }
  }

  // If language is already selected, show loading
  if (selectedLang) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#4A5D23', borderTopColor: 'transparent' }}></div>
          <h1 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>{t.common.redirecting}</h1>
          <p className="text-sm mt-2" style={{ color: '#666' }}>Please wait while we redirect you to the purchase page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{
            color: '#3D4D2E',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
          }}
        >
          {t.landing.title}
        </h1>
        <p className="text-lg mb-8" style={{ color: '#1A1A1A' }}>
          {t.landing.subtitle}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: '#7ED321', 
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600
            }}
          >
            {t.landing.english}
          </button>
          
          <button
            onClick={() => handleLanguageSelect('es')}
            className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: '#7ED321', 
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600
            }}
          >
            {t.landing.spanish}
          </button>
        </div>
      </div>
    </div>
  )
}