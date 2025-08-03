import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose'; // 1. Importamos Mongoose
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// --- Configuración inicial ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Motor de Plantillas Handlebars ---
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// --- Conexión a MongoDB ---
// 2. Reemplaza esta línea con tu propia URL de conexión de MongoDB Atlas
const MONGO_URI = "mongodb+srv://brianoviedo14:8ywswmz5zhSlN9nL@cluster0.r19mrf1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a la base de datos MongoDB"))
    .catch(error => console.error("❌ Error de conexión a la base de datos:", error));

// --- Rutas ---
// 3. Organizamos las rutas. Las de las vistas primero para renderizar las páginas.
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});