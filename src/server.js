import app from "./app.js"; // Importamos la app de Express
import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// --- Configuración de Puerto y BD ---
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// --- Conexión a MongoDB ---
console.log("Intentando conectar a MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a la base de datos");

    // --- Iniciar Servidor ---
    // Solo escuchamos en el puerto si la conexión a la BD es exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Error de conexión:", error));
