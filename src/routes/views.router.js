import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';

const router = Router();

// Vista para mostrar productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 5, sort } = req.query; // Ajusta el límite como prefieras
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };
        if (sort) {
            options.sort = { price: sort };
        }

        const result = await ProductModel.paginate({}, options);

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}` : null,
        });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos');
    }
});

// Vista para mostrar un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findOne({ _id: req.params.cid }).lean();
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send('Error al cargar la vista del carrito');
    }
});

// Redirección para la ruta raíz
router.get('/', (req, res) => {
    res.redirect('/products');
});

export default router;