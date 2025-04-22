/**
 * @file User.js
 * @description Modelo para usuarios/canales de MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
      comment: "Nombre de usuario/canal",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Por favor ingrese un correo electrónico válido",
      ],
      comment: "Correo electrónico del usuario",
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      comment: "Contraseña encriptada del usuario",
    },
    img: {
      type: String,
      default: "https://i.imgur.com/HeIi0wU.png",
      comment: "URL de la imagen de perfil",
    },
    coverImg: {
      type: String,
      default: "https://i.imgur.com/hNwMreU.png",
      comment: "URL de la imagen de portada del canal",
    },
    subscribers: {
      type: [String],
      default: [],
      comment: "Array de IDs de usuarios suscritos a este canal",
    },
    subscribedUsers: {
      type: [String],
      default: [],
      comment: "Array de IDs de canales a los que está suscrito este usuario",
    },
    description: {
      type: String,
      maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"],
      default: "",
      comment: "Descripción del canal",
    },
    socialLinks: {
      type: Map,
      of: String,
      default: {},
      comment:
        "Enlaces a redes sociales (ej: {twitter: 'url', instagram: 'url'})",
    },
    location: {
      type: String,
      comment: "Ubicación del usuario",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
      comment: "Rol del usuario en la plataforma",
    },
    isVerified: {
      type: Boolean,
      default: false,
      comment: "Indica si el canal está verificado",
    },
    isActive: {
      type: Boolean,
      default: true,
      comment: "Indica si la cuenta está activa o desactivada",
    },
    watchHistory: {
      type: [
        {
          videoId: String,
          watchedAt: { type: Date, default: Date.now },
          watchTimeSeconds: Number,
        },
      ],
      default: [],
      comment: "Historial de visualización del usuario",
    },
    preferences: {
      type: {
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "system",
          comment: "Preferencia de tema del usuario",
        },
        language: {
          type: String,
          default: "es",
          comment: "Preferencia de idioma del usuario",
        },
        notifications: {
          type: Boolean,
          default: true,
          comment: "Preferencia de recepción de notificaciones",
        },
        autoplay: {
          type: Boolean,
          default: true,
          comment: "Preferencia de reproducción automática",
        },
      },
      default: {
        theme: "system",
        language: "es",
        notifications: true,
        autoplay: true,
      },
      comment: "Preferencias de usuario",
    },
    lastLogin: {
      type: Date,
      comment: "Fecha/hora del último inicio de sesión",
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
UserSchema.index({ name: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ subscribers: 1 });
UserSchema.index({ name: "text", description: "text" });

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener información pública del usuario (sin datos sensibles)
UserSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();

  // Eliminar datos sensibles
  delete userObject.password;
  delete userObject.email;
  delete userObject.watchHistory;
  delete userObject.preferences;
  delete userObject.lastLogin;

  return userObject;
};

// Método para verificar si un usuario está suscrito a un canal
UserSchema.methods.isSubscribedTo = function (channelId) {
  return this.subscribedUsers.includes(channelId);
};

export default mongoose.model("User", UserSchema);
