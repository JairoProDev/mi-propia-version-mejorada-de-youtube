/**
 * @file api.js
 * @description Servicio centralizado para manejar peticiones a la API de MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import axios from "axios";

// Crear instancia de axios con configuración base
const API = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});

// Interceptor para añadir token en las cabeceras de las peticiones
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Manejar error de token expirado (401)
    if (response && response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/signin";
    }

    // Manejar error de permisos (403)
    if (response && response.status === 403) {
      console.error("No tienes permisos para realizar esta acción");
    }

    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  signin: (credentials) => API.post("/auth/signin", credentials),
  signup: (userData) => API.post("/auth/signup", userData),
  logout: () => {
    localStorage.removeItem("access_token");
    return API.post("/auth/logout");
  },
  getCurrentUser: () => API.get("/auth/me"),
};

// Servicios de video
export const videoService = {
  getVideos: (type = "random") => API.get(`/videos/${type}`),
  getVideoById: (id) => API.get(`/videos/find/${id}`),
  getTrendingVideos: () => API.get("/videos/trend"),
  getSubscriptionVideos: () => API.get("/videos/sub"),
  getVideosByTags: (tags) => API.get(`/videos/tags?tags=${tags}`),
  searchVideos: (query) => API.get(`/videos/search?q=${query}`),
  addVideo: (videoData) => API.post("/videos", videoData),
  updateVideo: (id, videoData) => API.put(`/videos/${id}`, videoData),
  deleteVideo: (id) => API.delete(`/videos/${id}`),
  addView: (id) => API.put(`/videos/view/${id}`),
  likeVideo: (id) => API.put(`/videos/like/${id}`),
  dislikeVideo: (id) => API.put(`/videos/dislike/${id}`),
  getVideoComments: (videoId) => API.get(`/comments/${videoId}`),
  addComment: (comment) => API.post("/comments", comment),
  deleteComment: (id) => API.delete(`/comments/${id}`),
  getVideoStats: (id) => API.get(`/stats/video/${id}`),
};

// Servicios de usuario
export const userService = {
  getUserById: (id) => API.get(`/users/find/${id}`),
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/users/${id}`),
  subscribe: (id) => API.put(`/users/sub/${id}`),
  unsubscribe: (id) => API.put(`/users/unsub/${id}`),
  getSubscribedChannels: (id) => API.get(`/users/subscribed/${id}`),
  updatePreferences: (preferences) =>
    API.put("/users/preferences", preferences),
  getWatchHistory: () => API.get("/users/history"),
  clearWatchHistory: () => API.delete("/users/history"),
  getChannelStats: (id) => API.get(`/stats/channel/${id}`),
};

// Servicios de playlists
export const playlistService = {
  getUserPlaylists: (userId) => API.get(`/playlists/user/${userId}`),
  getPlaylistById: (id) => API.get(`/playlists/find/${id}`),
  createPlaylist: (playlistData) => API.post("/playlists", playlistData),
  updatePlaylist: (id, playlistData) =>
    API.put(`/playlists/${id}`, playlistData),
  deletePlaylist: (id) => API.delete(`/playlists/${id}`),
  addVideoToPlaylist: (playlistId, videoId) =>
    API.put(`/playlists/${playlistId}/add/${videoId}`),
  removeVideoFromPlaylist: (playlistId, videoId) =>
    API.put(`/playlists/${playlistId}/remove/${videoId}`),
};

// Servicios de notificaciones
export const notificationService = {
  getUserNotifications: (userId) => API.get(`/notifications/user/${userId}`),
  markAsRead: (id) => API.put(`/notifications/read/${id}`),
  markAllAsRead: () => API.put("/notifications/read-all"),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
  getUnreadCount: () => API.get("/notifications/unread/count"),
};

export default API;
