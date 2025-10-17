import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Esta función genera un usuario simulado
export const generateMockUser = () => {
  // Hasheamos la contraseña "coder123" como se solicita
  const hashedPassword = bcrypt.hashSync("coder123", 10);

  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 70 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    cart: faker.database.mongodbObjectId(), // Asignamos un ID de carrito falso
    pets: [], // Array vacío como se solicita
  };
};

// Esta función genera un usuario con datos válidos para INSERTAR en la BD
export const generateRealUser = () => {
  const hashedPassword = bcrypt.hashSync("coder123", 10);
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 70 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [], // Array vacío como se solicita
    // El 'cart' se asignará en la lógica del router
  };
};
