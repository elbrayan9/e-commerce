// Usamos el módulo 'fs' (File System) de Node.js para interactuar con archivos.
// 'promises' nos permite usar async/await para un código más limpio.
import { promises as fs } from 'fs';

// Esta clase manejará la lógica de los productos.
export class ProductManager {
    constructor(path) {
        this.path = path; // La ruta al archivo de productos.
    }

    // Método para leer los productos del archivo.
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, devolvemos un array vacío.
            return [];
        }
    }

    // Método para agregar un nuevo producto.
    async addProduct(product) {
        const products = await this.getProducts();

        // Validamos que todos los campos obligatorios estén presentes.
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            throw new Error("Todos los campos son obligatorios, excepto thumbnails.");
        }

        // Generamos un ID único y autoincremental.
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            ...product,
            status: product.status !== undefined ? product.status : true, // Status es true por defecto.
            thumbnails: product.thumbnails || [] // Thumbnails es un array vacío por defecto.
        };

        products.push(newProduct);
        
        // Guardamos el array actualizado en el archivo.
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Método para obtener un producto por su ID.
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    // Método para actualizar un producto.
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            throw new Error("Producto no encontrado para actualizar.");
        }
        
        // No permitimos que el ID se actualice desde el body.
        delete updatedFields.id;

        const updatedProduct = { ...products[productIndex], ...updatedFields };
        products[productIndex] = updatedProduct;

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

    // Método para eliminar un producto.
    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            throw new Error("Producto no encontrado para eliminar.");
        }

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return { message: "Producto eliminado correctamente." };
    }
}