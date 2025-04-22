/**
 * @file stats.js
 * @description Rutas para operaciones de estadísticas
 * @author Tu Nombre
 * @version 1.0.0
 */

import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  getChannelStats,
  getVideoStats,
  getStatsSummary,
} from "../controllers/stats.js";

const router = express.Router();

// Rutas para estadísticas que requieren autenticación
router.get("/channel/:userId", verifyToken, getChannelStats);
router.get("/video/:videoId", verifyToken, getVideoStats);
router.get("/summary", verifyToken, getStatsSummary);

export default router;
