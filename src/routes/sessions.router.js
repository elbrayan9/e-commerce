import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { userService } from "../repositories/index.js";
import { UserDTO } from "../dto/User.dto.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const JWT_SECRET = "CoderSecret";

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({
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
    res
      .status(201)
      .json({
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

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ status: "success", payload: userDTO });
  }
);

export default router;
