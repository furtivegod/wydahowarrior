// Email translations for English and Spanish

export interface EmailTranslations {
  magicLink: {
    subject: string;
    greeting: string;
    ready: string;
    beginButton: string;
    instructions: string;
    support: string;
  };
  report: {
    subject: string;
    greeting: string;
    reportReady: string;
    downloadButton: string;
    support: string;
  };
}

export const emailTranslations: Record<'en' | 'es', EmailTranslations> = {
  en: {
    magicLink: {
      subject: "Your Wydaho Warrior Knife Check Assessment Is Ready",
      greeting: "Your assessment is ready.",
      ready: "Your assessment is ready.",
      beginButton: "Begin Your Assessment →",
      instructions: "Takes 30 minutes. No rush.<br>Find a quiet space where you can be honest.",
      support: "Questions? Need support? Contact us at",
    },
    report: {
      subject: "Your Personalized Wydaho Warrior Assessment Report",
      greeting: "Your personalized report is ready.",
      reportReady: "Your personalized 30-day transformation protocol has been generated.",
      downloadButton: "Download Your Report →",
      support: "Questions? Need support? Contact us at",
    },
  },
  es: {
    magicLink: {
      subject: "Tu Evaluación Wydaho Warrior Knife Check Está Lista",
      greeting: "Tu evaluación está lista.",
      ready: "Tu evaluación está lista.",
      beginButton: "Comenzar Tu Evaluación →",
      instructions: "Toma 30 minutos. Sin prisa.<br>Encuentra un espacio tranquilo donde puedas ser honesto.",
      support: "¿Preguntas? ¿Necesitas ayuda? Contáctanos en",
    },
    report: {
      subject: "Tu Informe Personalizado de Evaluación Wydaho Warrior",
      greeting: "Tu informe personalizado está listo.",
      reportReady: "Tu protocolo de transformación de 30 días personalizado ha sido generado.",
      downloadButton: "Descargar Tu Informe →",
      support: "¿Preguntas? ¿Necesitas ayuda? Contáctanos en",
    },
  },
};

