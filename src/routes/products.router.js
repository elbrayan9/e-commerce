import { Router } from 'express';
import { ProductModel } from '../models/product.model.js'; // 1. Importamos el Modelo, no el Manager

const router = Router();

// GET /api/products - Profesionalizado con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // 2. Configuración de opciones para la paginación y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true // Para que devuelva objetos JSON simples
        };

        if (sort) {
            // Ordena por precio ascendente ('asc') o descendente ('desc')
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        // 3. Configuración del filtro de búsqueda
        const filter = {};
        if (query) {
            // Buscamos por categoría (puedes expandir esto a otros campos)
            filter.category = { $regex: query, $options: "i" };
        }

        // 4. Realizamos la consulta paginada a la base de datos
        const result = await ProductModel.paginate(filter, options);

        // 5. Construcción del objeto de respuesta como pide la consigna
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null
        };
        
        res.json(response);

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos: ' + error.message });
    }
});


// Las demás rutas (GET by ID, POST, PUT, DELETE) también deben usar el modelo.
// Ejemplo de POST:
router.post('/', async (req, res) => {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});


export default router;