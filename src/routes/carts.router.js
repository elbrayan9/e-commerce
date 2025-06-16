import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';
import { ProductManager } from '../managers/ProductManager.js'; // Importamos para verificar que el producto exista

const router = Router();
const cartManager = new CartManager('src/data/carrito.json');
const productManager = new ProductManager('src/data/products.json'); // Instancia para validación

// POST /api/carts/
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito." });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Opcional pero recomendado: Verificar que el producto que se quiere agregar realmente exista.
        await productManager.getProductById(productId);

        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        // Si el error es "Producto no encontrado", podría venir de la validación.
        res.status(404).json({ error: error.message });
    }
});

export default router;