/**
 * @file Playlist.js
 * @description Modelo para listas de reproducción de MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      comment: "ID del usuario propietario de la lista",
    },
    name: {
      type: String,
      required: true,
      comment: "Nombre de la lista de reproducción",
    },
    desc: {
      type: String,
      comment: "Descripción de la lista de reproducción",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "private",
      comment: "Visibilidad de la lista: pública, privada o no listada",
    },
    imgUrl: {
      type: String,
      comment: "URL de la imagen de miniatura de la lista",
    },
    videos: {
      type: [String],
      default: [],
      comment: "Array de IDs de videos en la lista",
    },
    views: {
      type: Number,
      default: 0,
      comment: "Número de visualizaciones de la lista",
    },
    likes: {
      type: [String],
      default: [],
      comment: "Array de IDs de usuarios que han dado like",
    },
    dislikes: {
      type: [String],
      default: [],
      comment: "Array de IDs de usuarios que han dado dislike",
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
PlaylistSchema.index({ userId: 1 });
PlaylistSchema.index({ visibility: 1 });
PlaylistSchema.index({ name: "text", desc: "text" });

export default mongoose.model("Playlist", PlaylistSchema);
