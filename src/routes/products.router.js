import { Router } from 'express';
// No necesitamos el ProductManager aquí si lo manejamos desde app.js para los sockets,
// pero para las rutas HTTP sigue siendo necesario.
import { ProductManager } from '../managers/ProductManager.js';

// NOTA: El path a products.json debe ser consistente con el usado en app.js y views.router.js
// para evitar inconsistencias. Lo ideal es instanciarlo una sola vez y pasarlo, pero
// por ahora mantenemos la simplicidad de la consigna.
const productManager = new ProductManager('src/data/products.json');
const router = Router();


// GET /api/products/
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/products/
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        // --- MODIFICACIÓN: Emitir evento por WebSocket ---
        // Obtenemos la lista actualizada de productos
        const products = await productManager.getProducts();
        // Usamos el objeto 'io' que adjuntamos a 'req' en app.js
        // y emitimos el evento 'updateProducts' con la lista actualizada.
        req.io.emit('updateProducts', products);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        
        // --- MODIFICACIÓN: Emitir evento por WebSocket ---
        const products = await productManager.getProducts();
        req.io.emit('updateProducts', products);

        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(productId);
        
        // --- MODIFICACIÓN: Emitir evento por WebSocket ---
        const products = await productManager.getProducts();
        req.io.emit('updateProducts', products);

        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;