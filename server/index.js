/**
 * @file index.js
 * @description Archivo principal del servidor para la API de MiTube.
 * @author Tu Nombre
 * @version 1.0.0
 */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";

// Importación de rutas
import userRoutes from "./routes/user.js";
import videoRoutes from "./routes/video.js";
import commentRoutes from "./routes/comment.js";
import authRoutes from "./routes/auth.js";
import playlistRoutes from "./routes/playlist.js";
import notificationRoutes from "./routes/notification.js";
import statsRoutes from "./routes/stats.js";

// Configuración de variables de entorno
dotenv.config();

// Constantes
const PORT = process.env.PORT || 8800;
const MONGO_URI = process.env.MONGO || "mongodb://localhost:27017/mitubo";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_predeterminada";

/**
 * Conexión a MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    console.log("Intentando conectar a MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB conectado exitosamente");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    // No cerrar la aplicación si falla la conexión en entorno de desarrollo
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

// Inicialización de la aplicación Express
const app = express();
const server = http.createServer(app);

// Configuración de Socket.io para comunicación en tiempo real
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware global
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet()); // Seguridad HTTP
app.use(morgan("dev")); // Logging de solicitudes

// Configuración de Socket.io
io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Manejo de eventos de comentarios en tiempo real
  socket.on("new_comment", (data) => {
    socket.broadcast.emit("receive_comment", data);
  });

  // Manejo de notificaciones en tiempo real
  socket.on("new_notification", (data) => {
    socket.broadcast.emit("receive_notification", data);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);

// Ruta raíz para comprobar si la API está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de MiTube",
    status: "online",
    version: "1.0.0",
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Algo salió mal en el servidor";

  console.error(`❌ Error ${status}: ${message}`);

  return res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Iniciar el servidor
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al iniciar la base de datos:", err);
    // Iniciamos el servidor aunque la BD falle, para no bloquear el desarrollo del frontend
    server.listen(PORT, () => {
      console.log(
        `⚠️ Servidor ejecutándose en http://localhost:${PORT} (sin base de datos)`
      );
    });
  });

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error("❌ Error no manejado: ", err.message);
  console.error(err.stack);

  if (process.env.NODE_ENV === "production") {
    // Cerrar servidor y salir del proceso sólo en producción
    server.close(() => {
      process.exit(1);
    });
  }
});

export { io };
