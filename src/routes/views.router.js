import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

// Ruta para la vista home (estática)
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products }); // Renderiza home.handlebars y le pasa los productos
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts'); // Solo renderiza la vista, los productos se cargarán por socket
});

export default router;