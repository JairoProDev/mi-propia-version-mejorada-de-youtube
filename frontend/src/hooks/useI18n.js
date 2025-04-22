/**
 * @file useI18n.js
 * @description Hook personalizado para manejar internacionalización en MiTubo
 * @author Tu Nombre
 * @version 1.0.0
 */

import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/userSlice";

/**
 * Hook para facilitar el uso de i18n en la aplicación
 * @returns {Object} Métodos y estado para internacionalización
 */
const useI18n = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const storedLanguage = useSelector((state) => state.user.language);

  useEffect(() => {
    // Al montar el componente, actualizar i18n con el idioma guardado en Redux
    if (storedLanguage && i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [storedLanguage, i18n]);

  /**
   * Cambiar el idioma de la aplicación
   * @param {string} language - Código del idioma (es, en)
   * @returns {Promise<void>}
   */
  const changeLanguage = useCallback(
    async (language) => {
      if (!["es", "en"].includes(language)) {
        console.error("Idioma no soportado:", language);
        return;
      }

      setLoading(true);

      try {
        // Cambiar idioma en i18next
        await i18n.changeLanguage(language);

        // Guardar preferencia en localStorage
        localStorage.setItem("i18nextLng", language);

        // Actualizar el estado en Redux
        dispatch(setLanguage(language));
      } catch (error) {
        console.error("Error al cambiar idioma:", error);
      } finally {
        setLoading(false);
      }
    },
    [i18n, dispatch]
  );

  /**
   * Obtener el idioma actual
   * @returns {string} Código del idioma actual
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language || localStorage.getItem("i18nextLng") || "es";
  }, [i18n]);

  return {
    t, // Función de traducción
    i18n, // Instancia de i18next
    loading,
    changeLanguage,
    getCurrentLanguage,
    currentLanguage: getCurrentLanguage(),
    isSpanish: getCurrentLanguage().startsWith("es"),
    isEnglish: getCurrentLanguage().startsWith("en"),
  };
};

export default useI18n;
