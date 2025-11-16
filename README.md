# Backend API E-commerce 🚀

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker&labelColor=white)](https://hub.docker.com/r/brianoviedo/ecommerce-backend)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?style=for-the-badge&logo=swagger)](http://localhost:8080/api-docs)

Bienvenido al backend de nuestro E-commerce. Una API RESTful robusta construida con Node.js, Express y MongoDB, diseñada con una arquitectura profesional en capas, autenticación JWT, y completamente dockerizada para un despliegue sencillo.

---

## ✨ Características Principales

- **Arquitectura Profesional**: Código desacoplado y mantenible (DAO, DTO, Repository).
- **Gestión Completa**: APIs para administrar Productos, Carritos y Usuarios.
- **Flujo de Compra Real**: Lógica de compra que verifica stock, genera Tickets y actualiza carritos.
- **Autenticación y Autorización (RBAC)**:
  - Registro con contraseñas encriptadas (`bcrypt`).
  - Login seguro con **JSON Web Tokens (JWT)** en cookies `HttpOnly`.
  - Protección de rutas por **roles (Usuario/Admin)**.
- **Contenerización**: Imagen de **Docker** lista para producción disponible en DockerHub.
- **Documentación API**: Endpoints de `Sessions` documentados con **Swagger (OpenAPI)**.
- **Testing Funcional**: Pruebas de integración para el router de `Carts` con **Mocha, Chai y Supertest**.
- **Generación de Datos (Mocking)**: Endpoints con `faker-js` para generar datos de prueba.
- **Seguridad**: Uso de **DTOs** para proteger la información sensible del usuario.

---

## 🛠️ Stack Tecnológico

| Categoría         | Tecnología                                             |
| :---------------- | :----------------------------------------------------- |
| **Core**          | Node.js, Express                                       |
| **Base de Datos** | MongoDB, Mongoose, Mongoose Paginate v2                |
| **Seguridad**     | JWT (`jsonwebtoken`), `bcrypt`, Passport.js            |
| **Documentación** | Swagger (`swagger-jsdoc`, `swagger-ui-express`)        |
| **Testing**       | Mocha, Chai, Supertest                                 |
| **Despliegue**    | Docker                                                 |
| **Utilidades**    | `@faker-js/faker`, `nanoid`, `dotenv`, `cookie-parser` |

---

## 🏛️ Arquitectura del Proyecto

El servidor sigue una arquitectura en capas para separar responsabilidades:

- **`Routes`**: Define los endpoints de la API. Llama a la capa de Repositorio.
- **`Repositories`**: Contiene toda la **lógica de negocio**. Orquesta las operaciones y utiliza los DAOs.
- **`DAO (Data Access Object)`**: Es la única capa que habla con la base de datos (abstrae Mongoose).
- **`DTO (Data Transfer Object)`**: Modela los datos para evitar exponer información sensible.
- **`Middlewares`**: Intercepta peticiones para autenticación (Passport) y autorización (Roles).

---

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Prerrequisitos

Asegúrate de tener instalado:

- Node.js (v18+)
- Git
- Docker Desktop (opcional, para construir la imagen)

### 2. Clonar el Repositorio

```bash
git clone https://URL_DE_TU_REPOSITORIO.git
cd nombre-del-proyecto
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto.

```
MONGO_URI="mongodb+srv://tu_usuario:tu_password@cluster..."
PORT=8080
```

### 5. Iniciar el Servidor

¡Importante! El servidor ahora se inicia con `npm start` (que usa `src/server.js`).

```bash
npm start
```

El servidor estará corriendo en `http://localhost:8080`.

---

## 🧪 Pruebas y Calidad

Este proyecto incluye pruebas de integración y documentación de API.

### 1. Ejecutar Pruebas Funcionales

Para correr los tests de integración del router de Carritos:

```bash
npm test
```

### 2. Ver Documentación de la API

Una vez que el servidor esté corriendo (`npm start`), puedes ver la documentación de Swagger en:
**[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

---

## 🐳 Despliegue con Docker

Este proyecto está 100% dockerizado y listo para desplegar.

### 1. Link a la Imagen

La imagen oficial está alojada en DockerHub:
**[https://hub.docker.com/r/brianoviedo/ecommerce-backend](https://hub.docker.com/r/brianoviedo/ecommerce-backend)**

### 2. Ejecutar la Imagen

Puedes ejecutar el contenedor directamente desde DockerHub con este comando. No olvides pasar tu `MONGO_URI` como variable de entorno.

```bash
docker run -d -p 8080:8080 \
  -e MONGO_URI="tu_string_de_conexion_a_mongo_atlas" \
  --name ecommerce-api \
  brianoviedo/ecommerce-backend
```

### 3. Construir la Imagen (Local)

Si prefieres construir la imagen tú mismo:

```bash
docker build -t brianoviedo/ecommerce-backend .
```

---

## 📚 Documentación de la API

### Mocks y Pruebas (`/api/mocks`)

- **`GET /mockingusers?qty=N`**: Genera `N` usuarios simulados (por defecto 50).
- **`GET /mockingpets`**: Genera 100 mascotas simuladas.
- **`POST /generateData`**: Inserta datos de prueba en la BD. Body: `{ "users": 5, "pets": 3 }`.
- **`GET /getgeneratedusers`**: (Diagnóstico) Devuelve todos los usuarios.
- **`GET /getgeneratedpets`**: (Diagnóstico) Devuelve todas las mascotas.

### Sesiones (`/api/sessions`)

_(Documentado en Swagger en `/api-docs`)_

- **`POST /register`**: Registra un nuevo usuario.
- **`POST /login`**: Inicia sesión (devuelve cookie JWT).
- **`GET /current`**: Devuelve el usuario actual (usando DTO).

### Productos (`/api/products`)

- **`GET /`**: Lista productos (paginado).
- **`GET /:pid`**: Obtiene un producto.
- **`POST /`**: 🔒 **(Admin)** Crea un producto.
- **`PUT /:pid`**: 🔒 **(Admin)** Actualiza un producto.
- **`DELETE /:pid`**: 🔒 **(Admin)** Elimina un producto.

### Carritos (`/api/carts`)

- **`GET /:cid`**: Obtiene un carrito.
- **`POST /:cid/product/:pid`**: 🔒 **(Usuario)** Agrega un producto al carrito.
- **`POST /:cid/purchase`**: 🔒 **(Usuario)** Finaliza la compra (genera ticket y actualiza stock).
