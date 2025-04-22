/**
 * @file notification.js
 * @description Controlador para operaciones de notificaciones
 * @author Tu Nombre
 * @version 1.0.0
 */

import { createError } from "../error.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { io } from "../index.js";

/**
 * Crear una nueva notificación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const createNotification = async (req, res, next) => {
  try {
    const newNotification = new Notification({
      ...req.body,
      senderId: req.user.id
    });
    
    const savedNotification = await newNotification.save();
    
    // Emitir evento de Socket.io para notificar en tiempo real
    io.emit(`notification_${savedNotification.recipientId}`, savedNotification);
    
    res.status(201).json(savedNotification);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener notificaciones de un usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Verificar que el usuario solicite sus propias notificaciones
    if (req.user.id !== userId) {
      return next(createError(403, "Solo puedes ver tus propias notificaciones"));
    }
    
    const notifications = await Notification.find({ 
      recipientId: userId 
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

/**
 * Marcar notificación como leída
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return next(createError(404, "Notificación no encontrada"));
    }
    
    // Verificar que el usuario sea el propietario de la notificación
    if (notification.recipientId !== req.user.id) {
      return next(createError(403, "Solo puedes marcar tus propias notificaciones"));
    }
    
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    
    res.status(200).json(updatedNotification);
  } catch (err) {
    next(err);
  }
};

/**
 * Marcar todas las notificaciones como leídas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (err) {
    next(err);
  }
};

/**
 * Eliminar una notificación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return next(createError(404, "Notificación no encontrada"));
    }
    
    // Verificar que el usuario sea el propietario de la notificación
    if (notification.recipientId !== req.user.id) {
      return next(createError(403, "Solo puedes eliminar tus propias notificaciones"));
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Notificación eliminada correctamente" });
  } catch (err) {
    next(err);
  }
};

/**
 * Contar notificaciones no leídas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 */
export const countUnreadNotifications = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user.id,
      read: false
    });
    
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};

/**
 * Crear notificación de nueva suscripción
 * Esta función se utiliza internamente por otros controladores
 * @param {string} subscriberId - ID del usuario que se suscribe
 * @param {string} channelId - ID del canal al que se suscribe
 * @returns {Promise<Object>} La notificación creada
 */
export const createSubscriptionNotification = async (subscriberId, channelId) => {
  try {
    const subscriber = await User.findById(subscriberId);
    
    if (!subscriber) {
      throw new Error("Usuario no encontrado");
    }
    
    const notification = new Notification({
      recipientId: channelId,
      senderId: subscriberId,
      type: "new_subscription",
      content: `${subscriber.name} se ha suscrito a tu canal`,
      thumbnail: subscriber.img
    });
    
    const savedNotification = await notification.save();
    
    // Emitir evento de Socket.io para notificar en tiempo real
    io.emit(`notification_${channelId}`, savedNotification);
    
    return savedNotification;
  } catch (error) {
    console.error("Error al crear notificación de suscripción:", error);
    return null;
  }
}; 