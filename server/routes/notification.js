/**
 * @file notification.js
 * @description Rutas para operaciones de notificaciones
 * @author Tu Nombre
 * @version 1.0.0
 */

import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  countUnreadNotifications,
} from "../controllers/notification.js";

const router = express.Router();

// Rutas para notificaciones que requieren autenticación
router.post("/", verifyToken, createNotification);
router.get("/user/:userId", verifyToken, getUserNotifications);
router.put("/read/:id", verifyToken, markAsRead);
router.put("/read-all", verifyToken, markAllAsRead);
router.delete("/:id", verifyToken, deleteNotification);
router.get("/unread/count", verifyToken, countUnreadNotifications);

export default router;
