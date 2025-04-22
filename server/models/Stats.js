/**
 * @file Stats.js
 * @description Modelo para estadísticas de usuarios y videos en MiTube
 * @author Tu Nombre
 * @version 1.0.0
 */

import mongoose from "mongoose";

// Esquema para estadísticas diarias
const DailyStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    comment: "Fecha de las estadísticas",
  },
  views: {
    type: Number,
    default: 0,
    comment: "Número de vistas en esta fecha",
  },
  likes: {
    type: Number,
    default: 0,
    comment: "Número de likes en esta fecha",
  },
  dislikes: {
    type: Number,
    default: 0,
    comment: "Número de dislikes en esta fecha",
  },
  comments: {
    type: Number,
    default: 0,
    comment: "Número de comentarios en esta fecha",
  },
  subscribers: {
    type: Number,
    default: 0,
    comment: "Número de nuevos suscriptores en esta fecha",
  },
});

// Esquema para las métricas demográficas
const DemographicsSchema = new mongoose.Schema({
  ageRanges: {
    type: Map,
    of: Number,
    default: {},
    comment: "Distribución de edad de los espectadores",
  },
  genders: {
    type: Map,
    of: Number,
    default: {},
    comment: "Distribución de género de los espectadores",
  },
  countries: {
    type: Map,
    of: Number,
    default: {},
    comment: "Distribución geográfica de los espectadores",
  },
  devices: {
    type: Map,
    of: Number,
    default: {},
    comment: "Tipos de dispositivos utilizados por los espectadores",
  },
});

// Esquema principal para estadísticas
const StatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      comment: "ID del usuario o canal",
    },
    videoId: {
      type: String,
      index: true,
      comment: "ID del video (opcional, solo para estadísticas de videos)",
    },
    type: {
      type: String,
      required: true,
      enum: ["channel", "video"],
      comment: "Tipo de estadística: canal o video individual",
    },
    totalViews: {
      type: Number,
      default: 0,
      comment: "Número total de vistas",
    },
    totalLikes: {
      type: Number,
      default: 0,
      comment: "Número total de likes",
    },
    totalDislikes: {
      type: Number,
      default: 0,
      comment: "Número total de dislikes",
    },
    totalComments: {
      type: Number,
      default: 0,
      comment: "Número total de comentarios",
    },
    totalSubscribers: {
      type: Number,
      default: 0,
      comment: "Número total de suscriptores (solo para canales)",
    },
    watchTimeMinutes: {
      type: Number,
      default: 0,
      comment: "Tiempo total de visualización en minutos",
    },
    retentionRate: {
      type: Number,
      default: 0,
      comment: "Porcentaje promedio de retención de espectadores",
    },
    dailyStats: {
      type: [DailyStatsSchema],
      default: [],
      comment: "Estadísticas diarias",
    },
    demographics: {
      type: DemographicsSchema,
      default: () => ({}),
      comment: "Datos demográficos de los espectadores",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      comment: "Última actualización de las estadísticas",
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas
StatsSchema.index({ userId: 1, type: 1 });
StatsSchema.index({ videoId: 1 });
StatsSchema.index({ "dailyStats.date": 1 });

export default mongoose.model("Stats", StatsSchema);
