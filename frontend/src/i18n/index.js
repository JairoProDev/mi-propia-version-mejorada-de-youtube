/**
 * @file index.js
 * @description Configuración de internacionalización (i18n) para MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esTranslations from "./locales/es.json";
import enTranslations from "./locales/en.json";

// Configuración de i18next
i18n
  // Detectar idioma del navegador
  .use(LanguageDetector)
  // Inicializar react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    // Recursos (traducciones)
    resources: {
      es: {
        translation: esTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    // Idioma predeterminado
    fallbackLng: "es",
    // Detectar idioma del navegador
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // Configuración de interpolación
    interpolation: {
      escapeValue: false, // No escapar HTML
    },
    // Configuración de React
    react: {
      useSuspense: false,
    },
  });

export default i18n;
