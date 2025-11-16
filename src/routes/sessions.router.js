import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { userService } from "../repositories/index.js";
import { UserDTO } from "../dto/User.dto.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const JWT_SECRET = "CoderSecret";

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               age:
 *                 type: integer
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente
 *       '400':
 *         description: Error en la solicitud (ej. correo ya registrado)
 */

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "El correo electrónico ya está registrado.",
      });
    }
    const newCart = await CartModel.create({});
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userService.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id,
      role: email.startsWith("adminCoder@coder.com") ? "admin" : "user",
    });
    res.status(201).json({
      status: "success",
      message: "Usuario registrado",
      payload: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login exitoso, se setea cookie con JWT
 *       '401':
 *         description: Credenciales inválidas
 */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas." });
    }
    const userPayload = new UserDTO(user);
    const token = jwt.sign({ user: userPayload }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
    res.json({ status: "success", message: "Login exitoso" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtiene la sesión del usuario actual
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Datos del usuario actual (DTO)
 *       '401':
 *         description: No autenticado (sin JWT)
 */

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ status: "success", payload: userDTO });
  }
);

export default router;
