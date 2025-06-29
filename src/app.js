import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'; // Importamos el router de vistas
import { ProductManager } from './managers/ProductManager.js';

// --- Workaround para __dirname en ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// --- Middlewares para JSON y archivos estáticos ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Configuración del Motor de Plantillas Handlebars ---
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


// --- Inicialización del Servidor HTTP y Websockets ---
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

// Inicializamos socket.io con nuestro servidor http
const io = new Server(httpServer);

// --- Middleware para pasar 'io' a las rutas ---
// Esto nos permitirá usar el objeto 'io' en nuestras rutas API
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- Rutas ---
app.use('/', viewsRouter); // Rutas para las vistas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// --- Lógica de Sockets ---
const productManager = new ProductManager(path.join(__dirname, './data/products.json'));

io.on('connection', (socket) => {
    console.log("✅ Cliente conectado");

    // El cliente se conecta, le enviamos la lista de productos actual.
    productManager.getProducts().then(products => {
        socket.emit('updateProducts', products);
    });

    // Escuchamos el evento para agregar un producto
    socket.on('createProduct', (productData) => {
        productManager.addProduct(productData).then(() => {
            // Después de agregar, obtenemos la lista actualizada
            productManager.getProducts().then(products => {
                // y la emitimos a TODOS los clientes conectados
                io.emit('updateProducts', products);
            });
        }).catch(error => console.error(error));
    });

    // Escuchamos el evento para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId).then(() => {
            // Después de eliminar, obtenemos la lista actualizada
            productManager.getProducts().then(products => {
                // y la emitimos a TODOS los clientes conectados
                io.emit('updateProducts', products);
            });
        }).catch(error => console.error(error));
    });

    socket.on('disconnect', () => {
        console.log("❌ Cliente desconectado");
    });
});