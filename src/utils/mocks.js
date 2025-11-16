import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// --- LÓGICA DE USUARIOS (Existente) ---
export const generateMockUser = () => {
  const hashedPassword = bcrypt.hashSync("coder123", 10);
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 70 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    cart: faker.database.mongodbObjectId(),
    pets: [],
  };
};

export const generateRealUser = () => {
  const hashedPassword = bcrypt.hashSync("coder123", 10);
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 70 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
  };
};

// --- LÓGICA DE MASCOTAS (Nueva) ---

// Genera mascota simulada (para GET /mockingpets)
export const generateMockPet = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.animal.dog(),
    species: faker.helpers.arrayElement(["Perro", "Gato", "Pájaro", "Reptil"]),
    birthDate: faker.date.past(),
  };
};

// Genera mascota real (para POST /generateData)
export const generateRealPet = () => {
  return {
    name: faker.animal.dog(),
    species: faker.helpers.arrayElement(["Perro", "Gato", "Pájaro", "Reptil"]),
    birthDate: faker.date.past(),
  };
};
