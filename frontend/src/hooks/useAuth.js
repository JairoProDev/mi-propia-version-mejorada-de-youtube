/**
 * @file useAuth.js
 * @description Hook personalizado para manejar la autenticación en MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "../redux/userSlice";
import { authService } from "../services/api";

/**
 * Hook de autenticación que proporciona métodos y estado para el manejo de usuarios
 * @returns {Object} Métodos y estado de autenticación
 */
const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  /**
   * Iniciar sesión de usuario
   * @param {Object} credentials - Credenciales del usuario (email, password)
   * @returns {Promise<Object>} Resultado de la operación
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    dispatch(loginStart());

    try {
      const { data } = await authService.signin(credentials);

      // Guardar token
      if (data.token) {
        localStorage.setItem("access_token", data.token);
      }

      dispatch(loginSuccess(data.user));
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al iniciar sesión";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authService.signup(userData);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al registrar usuario";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Cerrar sesión de usuario
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      // Cerrar sesión localmente aunque haya error en el servidor
      dispatch(logoutAction());
    }
  };

  /**
   * Obtener el usuario actual desde el servidor
   * @returns {Promise<Object>} Datos del usuario actual
   */
  const fetchCurrentUser = async () => {
    if (!localStorage.getItem("access_token")) {
      return null;
    }

    setLoading(true);

    try {
      const { data } = await authService.getCurrentUser();
      dispatch(loginSuccess(data));
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al obtener usuario";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  // Cargar usuario al montar el componente si existe un token
  useEffect(() => {
    if (localStorage.getItem("access_token") && !currentUser) {
      fetchCurrentUser();
    }
  }, []);

  return {
    user: currentUser,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated: !!currentUser,
  };
};

export default useAuth;
