# E-commerce Backend API 🚀

Bienvenido al backend de nuestro E-commerce, una robusta API RESTful construida con Node.js, Express y MongoDB. Este proyecto no solo gestiona productos y carritos, sino que también implementa una arquitectura de software profesional en capas (DAO, DTO, Repository) y un sistema de autenticación y autorización completo basado en roles con JWT.

## ✨ Características Principales

- **Arquitectura Profesional en Capas**: Código desacoplado, mantenible y escalable gracias a la implementación de patrones de diseño como DAO, DTO y Repository.
- **Gestión de Productos Completa**: API REST para administrar el ciclo de vida de los productos, con rutas protegidas exclusivas para administradores.
- **Sistema de Carritos Avanzado**: Funcionalidad completa para la gestión de carritos de compra por usuario.
- **Flujo de Compra Real**: Una simulación de compra que verifica el stock en tiempo real, genera tickets de compra y actualiza el carrito con los productos no procesados.
- **Autenticación y Autorización (RBAC)**:
  - Registro de usuarios con **encriptación de contraseñas** (bcrypt).
  - Login seguro mediante **JSON Web Tokens (JWT)** almacenados en cookies `HttpOnly`.
  - Sistema de **roles (Usuario/Administrador)** para proteger endpoints y restringir acciones específicas.
- **Seguridad de Datos**: Uso de **DTO (Data Transfer Objects)** para evitar la exposición de información sensible del usuario en las respuestas de la API.
- **Manejo Seguro de Secretos**: Configuración a través de **variables de entorno** (`.env`) para proteger credenciales de la base de datos.
- **Vistas Renderizadas desde el Servidor**: Páginas básicas con Handlebars para la visualización de productos y carritos.

## 🏛️ Arquitectura del Proyecto

El servidor sigue una arquitectura en capas para separar responsabilidades, haciendo el código más limpio y fácil de mantener.

- **`Routes`**: Define los endpoints de la API. Su única responsabilidad es recibir peticiones HTTP, llamar a la capa de Repositorio y enviar una respuesta.
- **`Repositories`**: Contiene toda la **lógica de negocio**. Orquesta las operaciones y utiliza los DAOs para interactuar con la base de datos. Aquí reside la "inteligencia" de la aplicación.
- **`DAO (Data Access Object)`**: Es la única capa que tiene contacto directo con la base de datos. Abstrae las operaciones de persistencia (CRUD) para que el resto de la aplicación no dependa directamente de Mongoose.
- **`DTO (Data Transfer Object)`**: Patrón utilizado para modelar los datos que se transfieren entre las capas y hacia el cliente, asegurando que solo se exponga la información necesaria.
- **`Middlewares`**: Piezas de software que interceptan las peticiones para realizar tareas como la autenticación (Passport) y la autorización por roles.

## 🛠️ Stack Tecnológico

- **Entorno**: Node.js
- **Framework**: Express
- **Base de Datos**: MongoDB (con MongoDB Atlas)
- **ODM**: Mongoose
- **Autenticación**: Passport.js (Estrategia JWT)
- **Seguridad**: JSON Web Token (`jsonwebtoken`), `bcrypt`
- **Manejo de Peticiones**: `cookie-parser`
- **Variables de Entorno**: `dotenv`
- **IDs Únicos**: `nanoid` (para códigos de ticket)
- **Vistas**: Express Handlebars

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

```bash
git clone https://URL_DE_TU_REPOSITORIO.git
cd nombre-del-proyecto
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade tu URL de conexión a MongoDB.

```
MONGO_URI="mongodb+srv://tu_usuario:tu_password@cluster..."
```

### 4. Iniciar el Servidor

```bash
node src/app.js
```

El servidor estará corriendo en `http://localhost:8080`.

## 📚 Documentación de la API

### Sesiones (`/api/sessions`)

- **`POST /register`**: Registra un nuevo usuario.
- **`POST /login`**: Inicia sesión. Devuelve una cookie `coderCookieToken` con el JWT.
- **`GET /current`**: Devuelve los datos del usuario logueado (usando un DTO).

### Productos (`/api/products`)

- **`GET /`**: Lista todos los productos con paginación.
- **`GET /:pid`**: Obtiene un producto por su ID.
- **`POST /`**: 🔒 **(Admin)** Crea un nuevo producto.
- **`PUT /:pid`**: 🔒 **(Admin)** Actualiza un producto.
- **`DELETE /:pid`**: 🔒 **(Admin)** Elimina un producto.

### Carritos (`/api/carts`)

- **`POST /`**: Crea un nuevo carrito.
- **`GET /:cid`**: Obtiene un carrito con sus productos (usando `populate`).
- **`POST /:cid/product/:pid`**: 🔒 **(Usuario)** Agrega un producto al carrito.
- **`POST /:cid/purchase`**: 🔒 **(Usuario)** Finaliza el proceso de compra del carrito.
  - Verifica el stock de cada producto.
  - Genera un ticket de compra con los productos procesados.
  - Actualiza el stock de los productos comprados.
  - Devuelve una lista de los productos que no se pudieron comprar.
  - Actualiza el carrito para que solo contenga los productos no comprados.

## 📄 Vistas del Servidor

- **`/products`**: Muestra una lista paginada de productos.
- **`/carts/:cid`**: Muestra el detalle de un carrito específico.
