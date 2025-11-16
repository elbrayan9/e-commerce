import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js"; // Importamos la app (sin el server)
import mongoose from "mongoose";
import dotenv from "dotenv";

// --- 1. CONFIGURACIÓN DE PRUEBA ---
dotenv.config(); // Cargamos variables de entorno para el test
const MONGO_URI = process.env.MONGO_URI;
const request = supertest(app);

describe("API de Carritos", () => {
  // --- 2. HOOKS DE CONEXIÓN A LA BD ---
  before(async function () {
    // Damos más tiempo al hook de conexión si es necesario
    this.timeout(10000);
    console.log("Conectando a la base de datos para pruebas...");
    await mongoose.connect(MONGO_URI);
  });

  after(async () => {
    console.log("Desconectando de la base de datos...");
    await mongoose.connection.close();
  });

  // --- 3. PRUEBAS (TU CÓDIGO ANTERIOR) ---
  let agent;
  let userCartId;

  // "before all" hook ahora renombrado a "before tests" para claridad
  before(async () => {
    const loginResponse = await request.post("/api/sessions/login").send({
      email: "usuario.prueba@correo.com",
      password: "userPassword123",
    });

    agent = supertest.agent(app);
    agent.set("Cookie", loginResponse.headers["set-cookie"]);

    const currentResponse = await agent.get("/api/sessions/current");
    userCartId = currentResponse.body.payload.cart;
  });

  it("GET /api/carts/:cid - Debe obtener un carrito por ID", async () => {
    const response = await agent.get(`/api/carts/${userCartId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id", userCartId);
    expect(response.body.payload).to.have.property("products");
  });

  it("POST /api/carts/:cid/product/:pid - Debe agregar un producto al carrito", async () => {
    // ¡Recuerda que este ID debe existir en tu BD!
    const testProductId = "68ec0356a325574f622345d5"; // <-- EL ID QUE CONSEGUISTE DE ATLAS

    const response = await agent.post(
      `/api/carts/${userCartId}/product/${testProductId}`
    );

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");

    const productInCart = response.body.payload.products.some(
      (item) => item.product && item.product.toString() === testProductId
    );
    expect(productInCart).to.be.true;
  });
});
