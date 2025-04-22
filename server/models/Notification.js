/**
 * @file Notification.js
 * @description Model for user notifications in MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
      comment: "ID del usuario que recibe la notificación",
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      comment: "ID del usuario que generó la notificación",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "new_subscription",
        "new_comment",
        "comment_reply",
        "video_like",
        "new_video",
        "mention",
      ],
      comment: "Tipo de notificación",
    },
    content: {
      type: String,
      required: true,
      comment: "Contenido de la notificación",
    },
    resourceId: {
      type: String,
      comment: "ID del recurso asociado (video, comentario, etc.)",
    },
    read: {
      type: Boolean,
      default: false,
      comment: "Indica si la notificación ha sido leída",
    },
    thumbnail: {
      type: String,
      comment: "URL de la miniatura asociada a la notificación",
    },
  },
  { timestamps: true }
);

// Indices for query optimization
NotificationSchema.index({ recipientId: 1, read: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
