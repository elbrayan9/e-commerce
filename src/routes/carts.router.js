import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

const router = Router();

// POST para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({});
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
         res.status(500).json({ status: 'error', message: error.message });
    }
});
// POST /api/carts/:cid/products/:pid - Agrega un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        // Revisa si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex > -1) {
            // Si ya existe, incrementa la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si no existe, lo agrega al array
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// GET para traer un carrito y sus productos completos con populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findOne({ _id: req.params.cid });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:cid/products/:pid - Elimina un producto del carrito.
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString() !== pid);

        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /:cid - Actualiza el carrito con un arreglo de productos.
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        
        const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /:cid/products/:pid - Actualiza SÓLO la cantidad de un producto.
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        const cart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': Number(quantity) } },
            { new: true }
        );

        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado en el carrito' });

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:cid - Elimina todos los productos del carrito.
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;