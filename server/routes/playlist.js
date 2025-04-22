/**
 * @file playlist.js
 * @description Rutas para operaciones de listas de reproducción
 * @author Tu Nombre
 * @version 1.0.0
 */

import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
  increasePlaylistViews,
  likePlaylist,
  dislikePlaylist,
  searchPlaylists,
  getTrendingPlaylists
} from "../controllers/playlist.js";

const router = express.Router();

// Rutas principales de playlists
router.post("/", verifyToken, createPlaylist);
router.put("/:id", verifyToken, updatePlaylist);
router.delete("/:id", verifyToken, deletePlaylist);
router.get("/find/:id", getPlaylist);
router.put("/view/:id", increasePlaylistViews);

// Rutas para manejar videos en playlists
router.put("/:playlistId/add/:videoId", verifyToken, addVideoToPlaylist);
router.put("/:playlistId/remove/:videoId", verifyToken, removeVideoFromPlaylist);

// Rutas para interacciones del usuario
router.put("/like/:id", verifyToken, likePlaylist);
router.put("/dislike/:id", verifyToken, dislikePlaylist);

// Rutas para búsquedas y tendencias
router.get("/user/:userId", getUserPlaylists);
router.get("/search", searchPlaylists);
router.get("/trending", getTrendingPlaylists);

export default router; 