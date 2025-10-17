import { Router } from "express";
import { generateMockUser, generateRealUser } from "../utils/mocks.js";
import { userService, cartService } from "../repositories/index.js";

const router = Router();

// --- TAREA 2: Mover /mockingpets ---
// (Aquí moverías tu endpoint existente)
router.get("/mockingpets", (req, res) => {
  // Pega aquí tu lógica del desafío anterior para generar 100 mascotas.
  res.json({
    status: "success",
    message: "Endpoint /mockingpets (pendiente de tu lógica)",
  });
});

// --- TAREA 5: Generar 50 usuarios simulados (sin guardar) ---
router.get("/mockingusers", (req, res) => {
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push(generateMockUser());
  }
  res.json({ status: "success", payload: users });
});

// --- TAREA 6: Generar e INSERTAR datos en la BD ---
router.post("/generateData", async (req, res) => {
  const { users: userCount = 10, pets: petCount = 10 } = req.body;

  try {
    const generatedUsers = [];

    // --- Generar Usuarios ---
    for (let i = 0; i < userCount; i++) {
      // 1. Creamos un carrito nuevo para el usuario
      const newCart = await cartService.createCart();

      // 2. Generamos el usuario simulado
      const userData = generateRealUser();

      // 3. Asignamos el carrito
      userData.cart = newCart._id;

      // 4. Creamos el usuario en la BD
      const newUser = await userService.create(userData);
      generatedUsers.push(newUser);
    }

    // --- Generar Mascotas (Omitido) ---
    // Aquí iría tu lógica para generar e insertar mascotas
    // usando tu 'PetModel' o 'petService' cuando lo tengas.

    res.status(201).json({
      status: "success",
      message: `${userCount} usuarios generados e insertados en la BD.`,
      // La generación de ${petCount} mascotas está pendiente.
      payload: generatedUsers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "No se pudo generar los datos" });
  }
});

export default router;
