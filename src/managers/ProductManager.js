import { promises as fs } from 'fs';
// Importamos el módulo 'path' para manejar rutas de directorios
import path from 'path';

export class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        // Llamamos a nuestra función de inicialización en el constructor.
        // Esto asegura que el archivo y el directorio existan ANTES de que se intente usar.
        this._initialize();
    }

    // Nueva función privada para asegurar que el archivo y su directorio existan.
    async _initialize() {
        try {
            // Obtenemos la ruta del directorio del archivo.
            const dirPath = path.dirname(this.path);
            
            // Verificamos si el directorio existe. `recursive: true` crea directorios padres si es necesario.
            await fs.mkdir(dirPath, { recursive: true });

            // Intentamos acceder al archivo para ver si existe.
            await fs.access(this.path);
        } catch (error) {
            // Si el archivo no existe (error 'ENOENT'), lo creamos con un array vacío.
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
                console.log(`Archivo creado en: ${this.path}`);
            } else {
                // Si es otro tipo de error, lo lanzamos.
                throw error;
            }
        }
    }

    // El resto de los métodos (getProducts, addProduct, etc.) permanecen exactamente iguales.
    // ... (copia y pega aquí todos los demás métodos que ya tenías)
    
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    
    async addProduct(product) {
        const products = await this.getProducts();
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            throw new Error("Todos los campos son obligatorios, excepto thumbnails.");
        }
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            ...product,
            status: product.status !== undefined ? product.status : true,
            thumbnails: product.thumbnails || []
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado para actualizar.");
        }
        delete updatedFields.id;
        const updatedProduct = { ...products[productIndex], ...updatedFields };
        products[productIndex] = updatedProduct;
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

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