# E-commerce Backend

Este es el proyecto final del curso de Backend, una aplicación de servidor desarrollada con Node.js y Express para gestionar productos y carritos de un e-commerce. La persistencia de datos se maneja con una base de datos NoSQL (MongoDB) a través de Mongoose.

## ✨ Características Principales

- **Gestión de Productos**: API REST completa para crear, leer, actualizar y eliminar productos.
- **Listado Avanzado de Productos**: El endpoint principal de productos cuenta con:
    - **Paginación**: para manejar grandes catálogos de productos.
    - **Filtros**: para buscar productos por categoría o disponibilidad.
    - **Ordenamiento**: para ordenar los productos por precio (ascendente o descendente).
- **Gestión de Carritos**: API REST profesional para una gestión completa de los carritos de compra.
- **Vistas con Handlebars**: Vistas renderizadas desde el servidor para visualizar los productos con paginación y el contenido de un carrito específico.
- **Persistencia en MongoDB**: Toda la información se almacena de forma eficiente y escalable en una base de datos MongoDB Atlas.
- **Relaciones de Datos**: Uso de `populate` de Mongoose para relacionar los carritos con los productos de forma eficiente.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express**: Framework para la creación del servidor y la API REST.
- **MongoDB**: Base de datos NoSQL orientada a documentos.
- **Mongoose**: ODM (Object Document Mapper) para modelar y interactuar con la base de datos MongoDB.
- **Mongoose Paginate v2**: Plugin para implementar paginación en las consultas de Mongoose.
- **Express Handlebars**: Motor de plantillas para renderizar las vistas del lado del servidor.

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Clonar el repositorio
```bash
git clone https://URL_DE_TU_REPOSITORIO.git
cd nombre-de-la-carpeta
```

### 2. Instalar dependencias
Asegúrate de tener Node.js instalado. Luego, ejecuta:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto (la carpeta `BACKEND`). Este archivo guardará tu URL de conexión a la base de datos de forma segura.

```
MONGO_URI="mongodb+srv://tu_usuario:tu_password@tu_cluster_url/ecommerce?retryWrites=true&w=majority"
```
**Nota:** Deberás modificar tu archivo `app.js` para que lea esta variable en lugar de tener la URL directamente en el código.

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

### Productos (`/api/products`)

- **`GET /`**: Obtiene una lista paginada de productos.
    - **Query Params**:
        - `limit` (Number): Cantidad de productos por página. Default: 10.
        - `page` (Number): Número de la página a obtener. Default: 1.
        - `sort` (String): Ordenar por precio. Valores: `asc` o `desc`.
        - `query` (String): Filtrar por categoría.

- **`POST /`**: Crea un nuevo producto.
    - **Body (JSON)**:
      ```json
      {
        "title": "Producto de Ejemplo",
        "description": "Descripción del producto",
        "code": "PROD123",
        "price": 1500,
        "stock": 25,
        "category": "Ejemplos"
      }
      ```

### Carritos (`/api/carts`)

- **`POST /`**: Crea un nuevo carrito vacío.
- **`GET /:cid`**: Obtiene un carrito por su ID con todos sus productos detallados (usando `populate`).
- **`POST /:cid/product/:pid`**: Agrega un producto a un carrito. Si el producto ya existe, incrementa su cantidad.
- **`PUT /:cid/products/:pid`**: Actualiza la cantidad de un producto específico en el carrito.
    - **Body (JSON)**:
      ```json
      {
        "quantity": 5
      }
      ```
- **`DELETE /:cid/products/:pid`**: Elimina un producto específico del carrito.
- **`DELETE /:cid`**: Elimina todos los productos del carrito (lo vacía).

## 📄 Vistas del Servidor

- **`/products`**: Muestra la lista de productos paginada. Es la vista principal de la aplicación.
- **`/carts/:cid`**: Muestra el detalle de un carrito de compras específico con la lista de productos que contiene.
