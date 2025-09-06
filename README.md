# E-commerce Backend

Este es el proyecto final del curso de Backend, una aplicación de servidor desarrollada con Node.js y Express para gestionar productos y carritos de un e-commerce. La persistencia de datos se maneja con una base de datos NoSQL (MongoDB) a través de Mongoose.

Este proyecto también incluye un sistema completo de registro y autenticación de usuarios utilizando Passport y JSON Web Tokens (JWT).

## ✨ Características Principales

- **Gestión de Productos**: API REST completa para crear, leer, actualizar y eliminar productos.
- **Listado Avanzado de Productos**: El endpoint principal de productos cuenta con paginación, filtros y ordenamiento.
- **Gestión de Carritos**: API REST profesional para una gestión completa de los carritos de compra.
- **Autenticación de Usuarios**: Sistema seguro de registro y login.
    - **Registro de usuarios** con encriptación de contraseñas (bcrypt).
    - **Login con JWT**: La autenticación se maneja a través de JSON Web Tokens, que se almacenan en cookies seguras (HTTP-only).
    - **Rutas Protegidas**: Uso de Passport.js para proteger rutas y verificar la identidad del usuario.
- **Vistas con Handlebars**: Vistas renderizadas desde el servidor para visualizar los productos y el contenido de un carrito.
- **Persistencia en MongoDB**: Toda la información se almacena de forma eficiente y escalable.
- **Variables de Entorno**: Manejo seguro de datos sensibles (como la URL de la base de datos) a través de archivos `.env`.

## 🛠️ Tecnologías Utilizadas

- **Node.js** y **Express**
- **MongoDB** y **Mongoose**
- **Mongoose Paginate v2**
- **Express Handlebars**
- **Passport**: Middleware para autenticación.
- **Passport-JWT**: Estrategia de Passport para manejar JWT.
- **JSON Web Token (jsonwebtoken)**: Para la creación y verificación de tokens.
- **Bcrypt**: Para el hasheo de contraseñas.
- **Cookie-Parser**: Para el manejo de cookies.
- **Dotenv**: Para el manejo de variables de entorno.

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Clonar el repositorio
```bash
git clone https://URL_DE_TU_REPOSITORIO.git
cd nombre-de-la-carpeta
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y añade tu URL de conexión a MongoDB.
```
MONGO_URI="tu_url_de_conexion_a_mongodb"
```

### 4. Iniciar el servidor
Para iniciar el servidor en modo de desarrollo (con reinicio automático), usa:
```bash
npm run dev
```
O para una ejecución normal:
```bash
node src/app.js
```
El servidor estará corriendo en `http://localhost:8080`.

## 📚 Documentación de la API

### Sesiones (`/api/sessions`)

- **`POST /register`**: Registra un nuevo usuario.
    - **Body (JSON)**:
      ```json
      {
        "first_name": "Brian",
        "last_name": "Oviedo",
        "email": "brian.test@correo.com",
        "age": 25,
        "password": "miPassword123"
      }
      ```

- **`POST /login`**: Inicia sesión con un usuario existente. Si las credenciales son correctas, devuelve una cookie `coderCookieToken` con el JWT.
    - **Body (JSON)**:
      ```json
      {
        "email": "brian.test@correo.com",
        "password": "miPassword123"
      }
      ```

- **`GET /current`**: Obtiene los datos del usuario actualmente logueado. Requiere que la cookie `coderCookieToken` sea enviada en la petición.

### Productos (`/api/products`)

- **`GET /`**: Obtiene una lista paginada de productos.
    - **Query Params**:
        - `limit` (Number), `page` (Number), `sort` (String: 'asc'/'desc'), `query` (String: categoría).

- **`POST /`**: Crea un nuevo producto.

### Carritos (`/api/carts`)

- **`POST /`**: Crea un nuevo carrito vacío.
- **`GET /:cid`**: Obtiene un carrito por su ID con todos sus productos detallados.
- **`POST /:cid/product/:pid`**: Agrega un producto a un carrito.
- **`PUT /:cid/products/:pid`**: Actualiza la cantidad de un producto en el carrito.
- **`DELETE /:cid/products/:pid`**: Elimina un producto del carrito.
- **`DELETE /:cid`**: Vacía un carrito.

## 📄 Vistas del Servidor

- **`/products`**: Muestra la lista de productos paginada.
- **`/carts/:cid`**: Muestra el detalle de un carrito de compras específico.