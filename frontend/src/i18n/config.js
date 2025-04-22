import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en";
import esTranslations from "./locales/es";

// Verifica que las traducciones existan
console.log("Traducciones cargadas:", {
  en: !!enTranslations,
  es: !!esTranslations,
});

i18n
  // Detector de idioma del navegador
  .use(LanguageDetector)
  // Inicializador de React-i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
    fallbackLng: "en", // idioma de respaldo
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // react ya protege contra XSS
    },
    react: {
      useSuspense: false, // evita problemas con suspense durante la carga
    },
    debug: process.env.NODE_ENV === "development", // habilitar depuración en desarrollo
  });

// Para depuración en modo desarrollo
if (process.env.NODE_ENV === "development") {
  window.i18n = i18n;
}

export default i18n;
