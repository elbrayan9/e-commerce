import { Router } from "express";
import {
  generateMockUser,
  generateRealUser,
  generateMockPet, // Importamos la nueva función
  generateRealPet, // Importamos la nueva función
} from "../utils/mocks.js";
import { userService, cartService, petService } from "../repositories/index.js"; // Importamos petService

const router = Router();

// --- TAREA 2: Mover /mockingpets (AHORA CON LÓGICA) ---
router.get("/mockingpets", (req, res) => {
  const pets = [];
  for (let i = 0; i < 100; i++) {
    pets.push(generateMockPet());
  }
  res.json({ status: "success", payload: pets });
});

// --- TAREA 5: Generar usuarios simulados (AHORA DINÁMICO) ---
router.get("/mockingusers", (req, res) => {
  // Leemos la cantidad desde un query param '?qty=XX'
  // Si no se provee, el valor por defecto es 50.
  const count = parseInt(req.query.qty) || 50;

  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateMockUser());
  }
  res.json({ status: "success", payload: users });
});

// --- TAREA 6: Generar e INSERTAR datos en la BD (AHORA CON MASCOTAS) ---
router.post("/generateData", async (req, res) => {
  // Leemos los parámetros del body, con 10 como valor por defecto
  const { users: userCount = 10, pets: petCount = 10 } = req.body;

  try {
    const generatedUsers = [];
    const generatedPets = [];

    // --- Generar Usuarios ---
    for (let i = 0; i < userCount; i++) {
      const newCart = await cartService.createCart();
      const userData = generateRealUser();
      userData.cart = newCart._id;
      const newUser = await userService.create(userData);
      generatedUsers.push(newUser);
    }

    // --- Generar Mascotas (LÓGICA AÑADIDA) ---
    for (let i = 0; i < petCount; i++) {
      const petData = generateRealPet();
      const newPet = await petService.create(petData);
      generatedPets.push(newPet);
    }

    res.status(201).json({
      status: "success",
      message: `${userCount} usuarios y ${petCount} mascotas generados e insertados en la BD.`,
      payload: {
        users: generatedUsers,
        pets: generatedPets,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "No se pudo generar los datos" });
  }
});

// --- TAREA 7: Rutas de verificación GET ---
router.get("/getgeneratedusers", async (req, res) => {
  try {
    const users = await userService.findAll();
    res.json({
      status: "success",
      message: `Se encontraron ${users.length} usuarios en la BD.`,
      payload: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "No se pudo obtener los usuarios de la BD",
      });
  }
});

// Ruta de verificación para mascotas (NUEVA)
router.get("/getgeneratedpets", async (req, res) => {
  try {
    const pets = await petService.findAll();
    res.json({
      status: "success",
      message: `Se encontraron ${pets.length} mascotas en la BD.`,
      payload: pets,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "No se pudo obtener las mascotas de la BD",
      });
  }
});

export default router;
