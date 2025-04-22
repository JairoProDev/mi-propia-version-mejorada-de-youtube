/**
 * @file useI18n.js
 * @description Hook personalizado para manejar internacionalización en MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import { useTranslation } from "react-i18next";
import { useState, useCallback } from "react";
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

        // Si hay usuario autenticado, actualizar preferencia en redux
        if (currentUser) {
          dispatch(setLanguage(language));

          // Aquí también se podría guardar la preferencia en el servidor
          // si se implementa esa funcionalidad
        }
      } catch (error) {
        console.error("Error al cambiar idioma:", error);
      } finally {
        setLoading(false);
      }
    },
    [i18n, dispatch, currentUser]
  );

  /**
   * Obtener el idioma actual
   * @returns {string} Código del idioma actual
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language || "es";
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
