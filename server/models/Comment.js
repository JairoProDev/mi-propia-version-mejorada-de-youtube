/**
 * @file Comment.js
 * @description Modelo para comentarios de videos en MiTubo
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      comment: "ID del usuario que realiza el comentario",
    },
    videoId: {
      type: String,
      required: true,
      index: true,
      comment: "ID del video al que pertenece el comentario",
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "El comentario no puede exceder los 1000 caracteres"],
      comment: "Contenido del comentario",
    },
    likes: {
      type: [String],
      default: [],
      comment: "Array de IDs de usuarios que han dado like al comentario",
    },
    dislikes: {
      type: [String],
      default: [],
      comment: "Array de IDs de usuarios que han dado dislike al comentario",
    },
    parentId: {
      type: String,
      default: null,
      comment: "ID del comentario padre (si es una respuesta)",
    },
    isEdited: {
      type: Boolean,
      default: false,
      comment: "Indica si el comentario ha sido editado",
    },
    isPinned: {
      type: Boolean,
      default: false,
      comment: "Indica si el comentario está fijado en la parte superior",
    },
    isHeart: {
      type: Boolean,
      default: false,
      comment: "Indica si el creador del video ha destacado este comentario",
    },
    reports: {
      type: [
        {
          userId: String,
          reason: {
            type: String,
            enum: [
              "spam",
              "contenido_inapropiado",
              "acoso",
              "odio",
              "información_falsa",
              "otro",
            ],
          },
          description: String,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
      comment: "Reportes recibidos contra este comentario",
    },
    status: {
      type: String,
      enum: ["active", "hidden", "deleted", "flagged"],
      default: "active",
      comment: "Estado del comentario",
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
CommentSchema.index({ videoId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ desc: "text" });

// Método para verificar si un usuario ha dado like al comentario
CommentSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

// Método para verificar si un usuario ha dado dislike al comentario
CommentSchema.methods.isDislikedBy = function (userId) {
  return this.dislikes.includes(userId);
};

// Método para verificar si un comentario ha sido reportado por un usuario
CommentSchema.methods.isReportedBy = function (userId) {
  return this.reports.some((report) => report.userId === userId);
};

// Método para obtener la cantidad total de reacciones
CommentSchema.methods.getTotalReactions = function () {
  return this.likes.length + this.dislikes.length;
};

export default mongoose.model("Comment", CommentSchema);
