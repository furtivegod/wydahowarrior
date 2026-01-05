// Internationalization (i18n) configuration and translations

export type Language = 'en' | 'es';

export interface Translations {
  // Landing page
  landing: {
    title: string;
    subtitle: string;
    selectLanguage: string;
    english: string;
    spanish: string;
    continue: string;
  };
  
  // Consent screen
  consent: {
    welcome: string;
    aboutTitle: string;
    aboutText: string;
    privacyTitle: string;
    privacyText: string;
    agreeText: string;
    beginButton: string;
  };
  
  // Success page
  success: {
    title: string;
    subtitle: string;
    checkEmail: string;
    emailSentTo: string;
    subjectLine: string;
    from: string;
    cantFind: string;
    whatHappensNext: string;
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
    needHelp: string;
    contactSupport: string;
  };
  
  // Assessment
  assessment: {
    complete: string;
    reportSent: string;
    checkEmail: string;
  };
  
  // Chat interface
  chat: {
    placeholder: string;
    send: string;
    generating: string;
    error: string;
    retry: string;
  };
  
  // Common
  common: {
    loading: string;
    redirecting: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    landing: {
      title: 'Wydaho Warrior Knife Check Assessment',
      subtitle: 'Choose your language / Elige tu idioma',
      selectLanguage: 'Select Language',
      english: 'English',
      spanish: 'Spanish',
      continue: 'Continue',
    },
    consent: {
      welcome: 'Welcome to the Wydaho Warrior Knife Check Assessment for Burnt Out Chefs',
      aboutTitle: 'About Your Assessment',
      aboutText: 'This assessment is designed to help chefs sharpen their most important tool: themselves. We know that running on fumes can lead to feeling "dull" and unaligned in our mind, emotions, and physical well-being. This tool is not the solution itself, but an intelligent and logical roadmap for self-improvement and "honing" your greatest asset.',
      privacyTitle: 'Privacy & Consent',
      privacyText: 'By proceeding, you consent to the collection and processing of your responses for the purpose of generating your personalized protocol. Your data is encrypted and stored securely, and will not be shared with third parties.',
      agreeText: 'I understand and agree to proceed with the assessment',
      beginButton: 'Begin Assessment',
    },
    success: {
      title: 'You Just Made the Right Decision.',
      subtitle: 'Your personalized Wydaho Warrior Knife Check Assessment is ready to begin. In just minutes, you\'re going to uncover the exact patterns that have been keeping you stuck—and get a protocol built specifically to help you recover from burnout and rediscover your purpose as a chef-owner.',
      checkEmail: '📧 Check Your Email Right Now',
      emailSentTo: 'We\'ve sent your assessment link to',
      subjectLine: 'Subject line:',
      from: 'From:',
      cantFind: 'Can\'t find it? Check your spam folder or contact support',
      whatHappensNext: 'What Happens Next',
      step1Title: 'Click the link in your email',
      step1Text: 'Your personalized assessment is ready and waiting. Find a quiet space where you can be honest and reflective. Please elaborate as much as you can feel.',
      step2Title: 'Complete your assessment (30 minutes)',
      step2Text: 'The AI will ask follow-up questions based on your answers to map your specific patterns with precision. There\'s no time limit—take breaks if you need them.',
      step3Title: 'Receive your protocol (Immediately after completion)',
      step3Text: 'Your personalized 30-day transformation protocol will be delivered to your email the moment you finish. Save it. Reference it. Use it. This is your new potential road map that may lead to a 30 year transformation.',
      needHelp: 'Need help?',
      contactSupport: 'Contact support',
    },
    assessment: {
      complete: 'Assessment Complete!',
      reportSent: 'Your personalized assessment report has been generated and sent to your email.',
      checkEmail: '📧 Check your email for your personalized 30-day protocol',
    },
    chat: {
      placeholder: 'Type your response...',
      send: 'Send',
      generating: 'Generating response...',
      error: 'An error occurred. Please try again.',
      retry: 'Retry',
    },
    common: {
      loading: 'Loading...',
      redirecting: 'Redirecting to SamCart...',
    },
  },
  es: {
    landing: {
      title: 'Evaluación Wydaho Warrior Knife Check',
      subtitle: 'Elige tu idioma / Choose your language',
      selectLanguage: 'Seleccionar Idioma',
      english: 'Inglés',
      spanish: 'Español',
      continue: 'Continuar',
    },
    consent: {
      welcome: 'Bienvenido a la Evaluación Wydaho Warrior Knife Check para Chefs Agotados',
      aboutTitle: 'Acerca de Tu Evaluación',
      aboutText: 'Esta evaluación está diseñada para ayudar a los chefs a afilar su herramienta más importante: ellos mismos. Sabemos que funcionar al límite puede llevar a sentirse "desgastado" y desalineado en nuestra mente, emociones y bienestar físico. Esta herramienta no es la solución en sí, sino una hoja de ruta inteligente y lógica para la superación personal y el "afilado" de tu mayor activo.',
      privacyTitle: 'Privacidad y Consentimiento',
      privacyText: 'Al continuar, consientes la recopilación y el procesamiento de tus respuestas con el propósito de generar tu protocolo personalizado. Tus datos están encriptados y almacenados de forma segura, y no serán compartidos con terceros.',
      agreeText: 'Entiendo y acepto proceder con la evaluación',
      beginButton: 'Comenzar Evaluación',
    },
    success: {
      title: 'Acabas de Tomar la Decisión Correcta.',
      subtitle: 'Tu Evaluación Personalizada Wydaho Warrior Knife Check está lista para comenzar. En solo minutos, vas a descubrir los patrones exactos que te han mantenido estancado—y obtendrás un protocolo construido específicamente para ayudarte a recuperarte del agotamiento y redescubrir tu propósito como chef-propietario.',
      checkEmail: '📧 Revisa Tu Correo Ahora Mismo',
      emailSentTo: 'Hemos enviado el enlace de tu evaluación a',
      subjectLine: 'Asunto:',
      from: 'De:',
      cantFind: '¿No lo encuentras? Revisa tu carpeta de spam o contacta soporte',
      whatHappensNext: 'Qué Sigue',
      step1Title: 'Haz clic en el enlace de tu correo',
      step1Text: 'Tu evaluación personalizada está lista y esperando. Encuentra un espacio tranquilo donde puedas ser honesto y reflexivo. Por favor, elabora tanto como puedas sentir.',
      step2Title: 'Completa tu evaluación (30 minutos)',
      step2Text: 'La IA hará preguntas de seguimiento basadas en tus respuestas para mapear tus patrones específicos con precisión. No hay límite de tiempo—toma descansos si los necesitas.',
      step3Title: 'Recibe tu protocolo (Inmediatamente después de completar)',
      step3Text: 'Tu protocolo de transformación de 30 días personalizado será entregado a tu correo en el momento en que termines. Guárdalo. Consúltalo. Úsalo. Este es tu nuevo mapa de ruta potencial que puede llevar a una transformación de 30 años.',
      needHelp: '¿Necesitas ayuda?',
      contactSupport: 'Contactar soporte',
    },
    assessment: {
      complete: '¡Evaluación Completa!',
      reportSent: 'Tu informe de evaluación personalizado ha sido generado y enviado a tu correo.',
      checkEmail: '📧 Revisa tu correo para tu protocolo personalizado de 30 días',
    },
    chat: {
      placeholder: 'Escribe tu respuesta...',
      send: 'Enviar',
      generating: 'Generando respuesta...',
      error: 'Ocurrió un error. Por favor, intenta de nuevo.',
      retry: 'Reintentar',
    },
    common: {
      loading: 'Cargando...',
      redirecting: 'Redirigiendo a SamCart...',
    },
  },
};

// Helper function to get translations for a language
export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

// Helper function to detect language from URL or cookie
export function getLanguageFromRequest(request?: Request): Language {
  if (typeof window !== 'undefined') {
    // Client-side: check URL params, then cookie, then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    if (langParam && (langParam === 'en' || langParam === 'es')) {
      return langParam;
    }
    
    // Check cookie
    const cookies = document.cookie.split(';');
    const langCookie = cookies.find(c => c.trim().startsWith('lang='));
    if (langCookie) {
      const lang = langCookie.split('=')[1] as Language;
      if (lang === 'en' || lang === 'es') {
        return lang;
      }
    }
    
    // Check localStorage
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
      return storedLang;
    }
  }
  
  // Default to English
  return 'en';
}

// Helper to set language preference
export function setLanguagePreference(lang: Language) {
  if (typeof window !== 'undefined') {
    // Set cookie (expires in 1 year, available across all paths)
    // Don't set domain to allow it to work across subdomains if needed
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lang=${lang}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // Set localStorage (persists across browser sessions)
    localStorage.setItem('lang', lang);
    
    // Set sessionStorage (persists during browser session, even across redirects)
    sessionStorage.setItem('lang', lang);
  }
}

