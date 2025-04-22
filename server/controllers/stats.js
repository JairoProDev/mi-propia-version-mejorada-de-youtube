/**
 * @file stats.js
 * @description Controlador para operaciones con estadísticas
 * @author Tu Nombre
 * @version 1.0.0
 */

import { createError } from "../error.js";
import Stats from "../models/Stats.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

/**
 * Obtener estadísticas del canal de un usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getChannelStats = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Verificar que el usuario solicite sus propias estadísticas
    if (req.user.id !== userId) {
      return next(createError(403, "Solo puedes ver tus propias estadísticas"));
    }

    // Buscar estadísticas del canal
    let stats = await Stats.findOne({ userId, type: "channel" });

    // Si no existen estadísticas, crear un registro inicial
    if (!stats) {
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "Usuario no encontrado"));
      }

      // Crear estadísticas iniciales
      stats = new Stats({
        userId,
        type: "channel",
        totalSubscribers: user.subscribers ? user.subscribers.length : 0,
      });

      await stats.save();
    }

    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener estadísticas de un video
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getVideoStats = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    // Buscar el video para verificar propiedad
    const video = await Video.findById(videoId);
    if (!video) {
      return next(createError(404, "Video no encontrado"));
    }

    // Verificar que el usuario sea el propietario del video
    if (req.user.id !== video.userId) {
      return next(
        createError(
          403,
          "Solo puedes ver las estadísticas de tus propios videos"
        )
      );
    }

    // Buscar estadísticas del video
    let stats = await Stats.findOne({ videoId, type: "video" });

    // Si no existen estadísticas, crear un registro inicial
    if (!stats) {
      stats = new Stats({
        userId: video.userId,
        videoId,
        type: "video",
        totalViews: video.views || 0,
        totalLikes: video.likes ? video.likes.length : 0,
        totalDislikes: video.dislikes ? video.dislikes.length : 0,
      });

      await stats.save();
    }

    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

/**
 * Actualizar estadísticas después de ver un video
 * Esta función se llamaría internamente cuando un usuario ve un video
 * @param {string} videoId - ID del video
 * @param {Object} viewData - Datos de la visualización (duración, dispositivo, etc.)
 * @returns {Promise<Object>} Estadísticas actualizadas
 */
export const updateVideoStatsAfterView = async (videoId, viewData = {}) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video no encontrado");
    }

    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar estadísticas del video
    let videoStats = await Stats.findOne({ videoId, type: "video" });

    // Si no existen, crear nuevo registro
    if (!videoStats) {
      videoStats = new Stats({
        userId: video.userId,
        videoId,
        type: "video",
        totalViews: 1,
        watchTimeMinutes: viewData.duration || 0,
        dailyStats: [
          {
            date: today,
            views: 1,
          },
        ],
      });
    } else {
      // Actualizar estadísticas existentes
      videoStats.totalViews += 1;
      videoStats.watchTimeMinutes += viewData.duration || 0;

      // Actualizar o crear estadísticas diarias
      const dailyStatIndex = videoStats.dailyStats.findIndex(
        (stat) =>
          stat.date.toISOString().split("T")[0] ===
          today.toISOString().split("T")[0]
      );

      if (dailyStatIndex >= 0) {
        videoStats.dailyStats[dailyStatIndex].views += 1;
      } else {
        videoStats.dailyStats.push({
          date: today,
          views: 1,
        });
      }

      // Si hay demasiados registros diarios, mantener solo los últimos 90 días
      if (videoStats.dailyStats.length > 90) {
        videoStats.dailyStats.sort((a, b) => b.date - a.date);
        videoStats.dailyStats = videoStats.dailyStats.slice(0, 90);
      }

      videoStats.lastUpdated = new Date();
    }

    // Actualizar información demográfica si se proporciona
    if (viewData.country) {
      if (!videoStats.demographics.countries) {
        videoStats.demographics.countries = new Map();
      }
      const currentCount =
        videoStats.demographics.countries.get(viewData.country) || 0;
      videoStats.demographics.countries.set(viewData.country, currentCount + 1);
    }

    if (viewData.device) {
      if (!videoStats.demographics.devices) {
        videoStats.demographics.devices = new Map();
      }
      const currentCount =
        videoStats.demographics.devices.get(viewData.device) || 0;
      videoStats.demographics.devices.set(viewData.device, currentCount + 1);
    }

    // Guardar cambios
    await videoStats.save();

    // Actualizar también las estadísticas del canal
    await updateChannelStatsAfterView(video.userId, today);

    return videoStats;
  } catch (error) {
    console.error("Error al actualizar estadísticas del video:", error);
    return null;
  }
};

/**
 * Actualizar estadísticas del canal después de una vista
 * @param {string} userId - ID del usuario/canal
 * @param {Date} date - Fecha de la vista
 * @returns {Promise<Object>} Estadísticas actualizadas
 */
export const updateChannelStatsAfterView = async (userId, date) => {
  try {
    // Buscar estadísticas del canal
    let channelStats = await Stats.findOne({ userId, type: "channel" });

    // Si no existen, crear nuevo registro
    if (!channelStats) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      channelStats = new Stats({
        userId,
        type: "channel",
        totalViews: 1,
        totalSubscribers: user.subscribers ? user.subscribers.length : 0,
        dailyStats: [
          {
            date,
            views: 1,
          },
        ],
      });
    } else {
      // Actualizar estadísticas existentes
      channelStats.totalViews += 1;

      // Actualizar o crear estadísticas diarias
      const dailyStatIndex = channelStats.dailyStats.findIndex(
        (stat) =>
          stat.date.toISOString().split("T")[0] ===
          date.toISOString().split("T")[0]
      );

      if (dailyStatIndex >= 0) {
        channelStats.dailyStats[dailyStatIndex].views += 1;
      } else {
        channelStats.dailyStats.push({
          date,
          views: 1,
        });
      }

      // Si hay demasiados registros diarios, mantener solo los últimos 90 días
      if (channelStats.dailyStats.length > 90) {
        channelStats.dailyStats.sort((a, b) => b.date - a.date);
        channelStats.dailyStats = channelStats.dailyStats.slice(0, 90);
      }

      channelStats.lastUpdated = new Date();
    }

    // Guardar cambios
    await channelStats.save();

    return channelStats;
  } catch (error) {
    console.error("Error al actualizar estadísticas del canal:", error);
    return null;
  }
};

/**
 * Actualizar estadísticas después de una suscripción
 * @param {string} channelId - ID del canal que recibe la suscripción
 * @returns {Promise<Object>} Estadísticas actualizadas
 */
export const updateStatsAfterSubscription = async (channelId) => {
  try {
    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar estadísticas del canal
    let channelStats = await Stats.findOne({
      userId: channelId,
      type: "channel",
    });

    if (!channelStats) {
      const user = await User.findById(channelId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      channelStats = new Stats({
        userId: channelId,
        type: "channel",
        totalSubscribers: user.subscribers ? user.subscribers.length : 0,
        dailyStats: [
          {
            date: today,
            subscribers: 1,
          },
        ],
      });
    } else {
      // Actualizar estadísticas existentes
      const user = await User.findById(channelId);
      channelStats.totalSubscribers = user.subscribers
        ? user.subscribers.length
        : 0;

      // Actualizar o crear estadísticas diarias
      const dailyStatIndex = channelStats.dailyStats.findIndex(
        (stat) =>
          stat.date.toISOString().split("T")[0] ===
          today.toISOString().split("T")[0]
      );

      if (dailyStatIndex >= 0) {
        channelStats.dailyStats[dailyStatIndex].subscribers += 1;
      } else {
        channelStats.dailyStats.push({
          date: today,
          subscribers: 1,
        });
      }

      channelStats.lastUpdated = new Date();
    }

    // Guardar cambios
    await channelStats.save();

    return channelStats;
  } catch (error) {
    console.error(
      "Error al actualizar estadísticas después de suscripción:",
      error
    );
    return null;
  }
};

/**
 * Obtener resumen de estadísticas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getStatsSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar estadísticas del canal
    const channelStats = await Stats.findOne({ userId, type: "channel" });

    if (!channelStats) {
      return next(
        createError(404, "No se encontraron estadísticas para este canal")
      );
    }

    // Calcular métricas para los últimos 28 días
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 28);

    // Filtrar estadísticas diarias para los últimos 28 días
    const recentStats = channelStats.dailyStats.filter(
      (stat) => new Date(stat.date) >= lastMonth
    );

    // Calcular totales para el período
    const periodTotals = recentStats.reduce(
      (totals, stat) => {
        totals.views += stat.views || 0;
        totals.likes += stat.likes || 0;
        totals.subscribers += stat.subscribers || 0;
        totals.comments += stat.comments || 0;
        return totals;
      },
      { views: 0, likes: 0, subscribers: 0, comments: 0 }
    );

    // Obtener videos del usuario para calcular estadísticas agregadas
    const videos = await Video.find({ userId });
    const videoIds = videos.map((video) => video._id.toString());

    // Obtener estadísticas de todos los videos del usuario
    const videoStats = await Stats.find({
      videoId: { $in: videoIds },
      type: "video",
    });

    // Calcular promedios y métricas adicionales
    const totalVideoViews = videos.reduce(
      (sum, video) => sum + (video.views || 0),
      0
    );
    const avgViewsPerVideo =
      videos.length > 0 ? totalVideoViews / videos.length : 0;

    const totalLikes = videos.reduce(
      (sum, video) => sum + (video.likes ? video.likes.length : 0),
      0
    );
    const avgLikesPerVideo = videos.length > 0 ? totalLikes / videos.length : 0;

    // Preparar respuesta
    const summary = {
      channelStats: {
        totalSubscribers: channelStats.totalSubscribers,
        totalViews: channelStats.totalViews,
        subscribersGained28Days: periodTotals.subscribers,
        viewsGained28Days: periodTotals.views,
      },
      videoStats: {
        totalVideos: videos.length,
        totalVideoViews,
        avgViewsPerVideo,
        avgLikesPerVideo,
        mostViewedVideos: videos
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((video) => ({
            id: video._id,
            title: video.title,
            views: video.views,
            likes: video.likes ? video.likes.length : 0,
          })),
      },
      recentTrends: {
        dailyData: recentStats.map((stat) => ({
          date: stat.date,
          views: stat.views || 0,
          subscribers: stat.subscribers || 0,
        })),
      },
    };

    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
};
