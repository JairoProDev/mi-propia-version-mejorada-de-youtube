import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en";
import esTranslations from "./locales/es";

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
  });

export default i18n;
