/**
 * @file Video.js
 * @description Modelo para videos de MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      comment: "ID del usuario propietario del video",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"],
      maxlength: [100, "El título no puede exceder los 100 caracteres"],
      comment: "Título del video",
    },
    desc: {
      type: String,
      required: true,
      maxlength: [5000, "La descripción no puede exceder los 5000 caracteres"],
      comment: "Descripción del video",
    },
    imgUrl: {
      type: String,
      required: true,
      comment: "URL de la miniatura del video",
    },
    videoUrl: {
      type: String,
      required: true,
      comment: "URL del archivo de video",
    },
    views: {
      type: Number,
      default: 0,
      comment: "Número de vistas del video",
    },
    duration: {
      type: Number,
      default: 0,
      comment: "Duración del video en segundos",
    },
    status: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
      comment: "Estado de privacidad del video",
    },
    tags: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (tags) {
            return tags.length <= 15;
          },
          message: "No puedes añadir más de 15 etiquetas",
        },
        {
          validator: function (tags) {
            return tags.every((tag) => tag.length <= 30);
          },
          message: "Las etiquetas no pueden tener más de 30 caracteres",
        },
      ],
      comment: "Etiquetas del video para búsquedas",
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
    category: {
      type: String,
      required: true,
      enum: [
        "música",
        "gaming",
        "deportes",
        "noticias",
        "educación",
        "comedia",
        "entretenimiento",
        "tecnología",
        "ciencia",
        "viajes",
        "mascotas",
        "cocina",
        "moda",
        "autos",
        "otro",
      ],
      comment: "Categoría principal del video",
    },
    allowComments: {
      type: Boolean,
      default: true,
      comment: "Indica si se permiten comentarios en el video",
    },
    allowRatings: {
      type: Boolean,
      default: true,
      comment: "Indica si se permiten valoraciones (likes/dislikes)",
    },
    language: {
      type: String,
      default: "es",
      comment: "Idioma principal del video",
    },
    subtitles: {
      type: [
        {
          language: String,
          url: String,
        },
      ],
      default: [],
      comment: "Subtítulos disponibles para el video",
    },
    isFeatured: {
      type: Boolean,
      default: false,
      comment: "Indica si el video está destacado en la plataforma",
    },
    isOriginal: {
      type: Boolean,
      default: true,
      comment: "Indica si el contenido es original",
    },
    restrictedInCountries: {
      type: [String],
      default: [],
      comment: "Países donde el video está restringido",
    },
    hasAgeRestriction: {
      type: Boolean,
      default: false,
      comment: "Indica si el video tiene restricción de edad",
    },
    avgWatchTime: {
      type: Number,
      default: 0,
      comment: "Tiempo promedio de visualización en segundos",
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
VideoSchema.index({ title: "text", desc: "text", tags: "text" });
VideoSchema.index({ views: -1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ category: 1 });
VideoSchema.index({ status: 1 });

// Método para verificar si un usuario ha dado like
VideoSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

// Método para verificar si un usuario ha dado dislike
VideoSchema.methods.isDislikedBy = function (userId) {
  return this.dislikes.includes(userId);
};

// Método para obtener duración formateada
VideoSchema.methods.getFormattedDuration = function () {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default mongoose.model("Video", VideoSchema);
