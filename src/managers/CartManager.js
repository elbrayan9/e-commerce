import { promises as fs } from 'fs';
// 1. Importamos el módulo 'path' para manejar rutas de directorios.
import path from 'path';

// Esta clase manejará la lógica de los carritos.
export class CartManager {
    constructor(filePath) {
        this.path = filePath; // La ruta al archivo de carritos.
        // 2. Llamamos a la función de inicialización para asegurar que el archivo exista.
        this._initialize();
    }

    // 3. Nuevo método privado para asegurar que el archivo y su directorio existan.
    async _initialize() {
        try {
            const dirPath = path.dirname(this.path);
            await fs.mkdir(dirPath, { recursive: true });
            await fs.access(this.path);
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío.
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
                console.log(`Archivo creado en: ${this.path}`);
            } else {
                throw error;
            }
        }
    }

    // --- El resto de los métodos permanecen exactamente iguales ---

    // Método para leer los carritos del archivo.
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Si hay un error, empezamos con un array vacío.
        }
    }

    // Método para crear un nuevo carrito.
    async createCart() {
        const carts = await this.getCarts();
        
        const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
        
        const newCart = {
            id: newId,
            products: [] // El carrito se crea vacío.
        };

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    // Método para obtener un carrito por su ID.
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }
        return cart;
    }

    // Método para agregar un producto a un carrito.
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado.");
        }

        const cart = carts[cartIndex];
        const productIndexInCart = cart.products.findIndex(p => p.product === productId);

        if (productIndexInCart !== -1) {
            // Si el producto ya existe, incrementamos la cantidad.
            cart.products[productIndexInCart].quantity += 1;
        } else {
            // Si el producto no existe, lo agregamos.
            cart.products.push({ product: productId, quantity: 1 });
        }

        carts[cartIndex] = cart;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}