import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  const jwtSecret = process.env.JWT_SECRET || "clave_secreta_predeterminada";
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
