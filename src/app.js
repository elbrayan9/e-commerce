import express from 'express';
// Importamos nuestros routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

// Middlewares para poder leer JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montamos los routers en las rutas base correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ponemos a escuchar el servidor en el puerto 8080
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});