import { promises as fs } from 'fs';

// Esta clase manejará la lógica de los carritos.
export class CartManager {
    constructor(path) {
        this.path = path; // La ruta al archivo de carritos.
    }

    // Método para leer los carritos del archivo.
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Si no existe, empezamos con un array vacío.
        }
    }

    // Método para crear un nuevo carrito.
    async createCart() {
        const carts = await this.getCarts();
        
        // Generamos un ID único.
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