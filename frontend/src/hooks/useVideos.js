/**
 * @file useVideos.js
 * @description Hook personalizado para manejar operaciones con videos
 * @author Tu Nombre
 * @version 1.0.0
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { videoService } from '../services/api';
import { 
  likeVideo as likeVideoAction, 
  dislikeVideo as dislikeVideoAction
} from '../redux/videoSlice';

/**
 * Hook para manejar operaciones relacionadas con videos
 * @returns {Object} Métodos y estado para manejar videos
 */
const useVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const dispatch = useDispatch();

  /**
   * Obtener lista de videos según el tipo
   * @param {string} type - Tipo de videos (random, trend, sub)
   * @returns {Promise<Array>} Lista de videos
   */
  const fetchVideos = async (type = 'random') => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.getVideos(type);
      setVideos(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener videos';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Obtener un video por su ID
   * @param {string} videoId - ID del video a obtener
   * @returns {Promise<Object>} Datos del video
   */
  const fetchVideoById = async (videoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.getVideoById(videoId);
      setCurrentVideo(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el video';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Buscar videos por texto
   * @param {string} query - Texto de búsqueda
   * @returns {Promise<Array>} Lista de videos que coinciden con la búsqueda
   */
  const searchVideos = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.searchVideos(query);
      setVideos(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en la búsqueda';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Añadir una vista a un video
   * @param {string} videoId - ID del video
   * @returns {Promise<Object>} Resultado de la operación
   */
  const addView = async (videoId) => {
    try {
      const { data } = await videoService.addView(videoId);
      return data;
    } catch (err) {
      console.error('Error al añadir vista:', err);
      throw err;
    }
  };

  /**
   * Dar like a un video
   * @param {string} videoId - ID del video
   * @returns {Promise<Object>} Resultado de la operación
   */
  const likeVideo = async (videoId) => {
    try {
      const { data } = await videoService.likeVideo(videoId);
      dispatch(likeVideoAction(videoId));
      
      // Actualizar el video actual si es el mismo
      if (currentVideo && currentVideo._id === videoId) {
        setCurrentVideo((prev) => ({
          ...prev,
          likes: [...(prev.likes || []), 'current-user-id'], // Actualizar localmente
          dislikes: (prev.dislikes || []).filter(id => id !== 'current-user-id')
        }));
      }
      
      return data;
    } catch (err) {
      console.error('Error al dar like:', err);
      throw err;
    }
  };

  /**
   * Dar dislike a un video
   * @param {string} videoId - ID del video
   * @returns {Promise<Object>} Resultado de la operación
   */
  const dislikeVideo = async (videoId) => {
    try {
      const { data } = await videoService.dislikeVideo(videoId);
      dispatch(dislikeVideoAction(videoId));
      
      // Actualizar el video actual si es el mismo
      if (currentVideo && currentVideo._id === videoId) {
        setCurrentVideo((prev) => ({
          ...prev,
          dislikes: [...(prev.dislikes || []), 'current-user-id'], // Actualizar localmente
          likes: (prev.likes || []).filter(id => id !== 'current-user-id')
        }));
      }
      
      return data;
    } catch (err) {
      console.error('Error al dar dislike:', err);
      throw err;
    }
  };

  /**
   * Subir un nuevo video
   * @param {Object} videoData - Datos del video a subir
   * @returns {Promise<Object>} Resultado de la operación
   */
  const uploadVideo = async (videoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.addVideo(videoData);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al subir el video';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Actualizar un video existente
   * @param {string} videoId - ID del video a actualizar
   * @param {Object} videoData - Nuevos datos del video
   * @returns {Promise<Object>} Resultado de la operación
   */
  const updateVideo = async (videoId, videoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.updateVideo(videoId, videoData);
      
      if (currentVideo && currentVideo._id === videoId) {
        setCurrentVideo(data);
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el video';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Eliminar un video
   * @param {string} videoId - ID del video a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  const deleteVideo = async (videoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.deleteVideo(videoId);
      
      // Actualizar la lista de videos si existe
      if (videos.length > 0) {
        setVideos((prev) => prev.filter(video => video._id !== videoId));
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el video';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Obtener estadísticas de un video
   * @param {string} videoId - ID del video
   * @returns {Promise<Object>} Estadísticas del video
   */
  const getVideoStats = async (videoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await videoService.getVideoStats(videoId);
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener estadísticas';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return {
    videos,
    currentVideo,
    loading,
    error,
    fetchVideos,
    fetchVideoById,
    searchVideos,
    addView,
    likeVideo,
    dislikeVideo,
    uploadVideo,
    updateVideo,
    deleteVideo,
    getVideoStats
  };
};

export default useVideos; 