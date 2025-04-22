/**
 * @file playlist.js
 * @description Controlador para operaciones de listas de reproducción
 * @author Tu Nombre
 * @version 1.0.0
 */

import { createError } from "../error.js";
import Playlist from "../models/Playlist.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

/**
 * Crear una nueva lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const createPlaylist = async (req, res, next) => {
  try {
    const newPlaylist = new Playlist({ userId: req.user.id, ...req.body });
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);
  } catch (err) {
    next(err);
  }
};

/**
 * Actualizar una lista de reproducción existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist)
      return next(createError(404, "Lista de reproducción no encontrada"));

    if (req.user.id === playlist.userId) {
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedPlaylist);
    } else {
      return next(
        createError(
          403,
          "Solo puedes actualizar tus propias listas de reproducción"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Eliminar una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist)
      return next(createError(404, "Lista de reproducción no encontrada"));

    if (req.user.id === playlist.userId) {
      await Playlist.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: "Lista de reproducción eliminada correctamente" });
    } else {
      return next(
        createError(
          403,
          "Solo puedes eliminar tus propias listas de reproducción"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener una lista de reproducción por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist)
      return next(createError(404, "Lista de reproducción no encontrada"));

    // Verificar visibilidad y permisos
    if (playlist.visibility === "private" && playlist.userId !== req.user?.id) {
      return next(
        createError(
          403,
          "No tienes permiso para ver esta lista de reproducción"
        )
      );
    }

    res.status(200).json(playlist);
  } catch (err) {
    next(err);
  }
};

/**
 * Añadir un video a una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const addVideoToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, videoId } = req.params;

    // Verificar si el video existe
    const video = await Video.findById(videoId);
    if (!video) return next(createError(404, "Video no encontrado"));

    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
      return next(createError(404, "Lista de reproducción no encontrada"));

    if (req.user.id !== playlist.userId) {
      return next(
        createError(
          403,
          "Solo puedes añadir videos a tus propias listas de reproducción"
        )
      );
    }

    // Evitar duplicados
    if (playlist.videos.includes(videoId)) {
      return next(
        createError(400, "El video ya está en la lista de reproducción")
      );
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { videos: videoId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Video añadido a la lista de reproducción" });
  } catch (err) {
    next(err);
  }
};

/**
 * Eliminar un video de una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const removeVideoFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
      return next(createError(404, "Lista de reproducción no encontrada"));

    if (req.user.id !== playlist.userId) {
      return next(
        createError(
          403,
          "Solo puedes eliminar videos de tus propias listas de reproducción"
        )
      );
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { videos: videoId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Video eliminado de la lista de reproducción" });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener todas las listas de reproducción de un usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Si el usuario solicita sus propias listas
    if (req.user?.id === userId) {
      const playlists = await Playlist.find({ userId });
      return res.status(200).json(playlists);
    }

    // Si otro usuario solicita ver las listas, solo mostrar las públicas
    const playlists = await Playlist.find({
      userId,
      visibility: "public",
    });

    res.status(200).json(playlists);
  } catch (err) {
    next(err);
  }
};

/**
 * Incrementar las vistas de una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const increasePlaylistViews = async (req, res, next) => {
  try {
    await Playlist.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json({ message: "Vista incrementada correctamente" });
  } catch (err) {
    next(err);
  }
};

/**
 * Dar like a una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const likePlaylist = async (req, res, next) => {
  const userId = req.user.id;
  const playlistId = req.params.id;

  try {
    // Actualizar la lista de reproducción: quitar de dislikes y añadir a likes
    await Playlist.findByIdAndUpdate(playlistId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res
      .status(200)
      .json({ message: "Te ha gustado esta lista de reproducción" });
  } catch (err) {
    next(err);
  }
};

/**
 * Quitar like de una lista de reproducción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const dislikePlaylist = async (req, res, next) => {
  const userId = req.user.id;
  const playlistId = req.params.id;

  try {
    // Actualizar la lista de reproducción: quitar de likes y añadir a dislikes
    await Playlist.findByIdAndUpdate(playlistId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res
      .status(200)
      .json({ message: "No te ha gustado esta lista de reproducción" });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener listas de reproducción por su contenido (para búsquedas)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const searchPlaylists = async (req, res, next) => {
  const query = req.query.q;

  try {
    // Buscar solo en listas públicas
    const playlists = await Playlist.find({
      visibility: "public",
      $text: { $search: query },
    }).limit(20);

    res.status(200).json(playlists);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener listas de reproducción populares
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getTrendingPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({
      visibility: "public",
    })
      .sort({ views: -1 })
      .limit(10);

    res.status(200).json(playlists);
  } catch (err) {
    next(err);
  }
};
