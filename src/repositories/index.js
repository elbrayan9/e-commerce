import { ProductsMongoDAO } from "../dao/mongo/ProductsMongo.dao.js";
import { CartsMongoDAO } from "../dao/mongo/CartsMongo.dao.js";
import { UsersMongoDAO } from "../dao/mongo/UsersMongo.dao.js";
import { TicketsMongoDAO } from "../dao/mongo/TicketsMongo.dao.js";
import { PetsMongoDAO } from "../dao/mongo/PetsMongo.dao.js";
import { nanoid } from "nanoid";

// --- Instancias de DAOs ---
const productsDAO = new ProductsMongoDAO();
const cartsDAO = new CartsMongoDAO();
const usersDAO = new UsersMongoDAO();
const ticketsDAO = new TicketsMongoDAO();
const petsDAO = new PetsMongoDAO();

// --- Repositorios (Lógica de Negocio) ---

class ProductRepository {
  async getProducts(filter, options) {
    return await productsDAO.getAll(filter, options);
  }
  async getProductById(pid) {
    return await productsDAO.getById(pid);
  }
  async createProduct(productData) {
    return await productsDAO.create(productData);
  }
  async updateProduct(pid, productData) {
    return await productsDAO.update(pid, productData);
  }
  async deleteProduct(pid) {
    return await productsDAO.delete(pid);
  }
}

class CartRepository {
  async createCart() {
    return await cartsDAO.create();
  }
  async getCartById(cid) {
    return await cartsDAO.getById(cid);
  }
  async addProductToCart(cid, pid) {
    const cart = await this.getCartById(cid);
    const productIndex = cart.products.findIndex(
      (p) => p.product._id.toString() === pid
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    return await cartsDAO.update(cid, cart);
  }
  async purchaseCart(cid, purchaserEmail) {
    const cart = await cartsDAO.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const failedProducts = [];
    const purchasedItems = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await productsDAO.getById(item.product._id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productsDAO.update(product._id, { stock: product.stock });
        totalAmount += item.quantity * product.price;
        purchasedItems.push(item);
      } else {
        failedProducts.push(item.product._id);
      }
    }

    let ticket = null;
    if (purchasedItems.length > 0) {
      ticket = await ticketsDAO.create({
        code: nanoid(),
        amount: totalAmount,
        purchaser: purchaserEmail,
      });
    }

    const remainingProducts = cart.products.filter((item) =>
      failedProducts.includes(item.product._id)
    );
    await cartsDAO.update(cid, { products: remainingProducts });

    return { ticket, failedProducts };
  }
}

// Exportamos una única instancia de cada servicio
export const productService = new ProductRepository();
export const cartService = new CartRepository();
export const userService = new UsersMongoDAO(); // El DAO es suficiente aquí por ahora
export const petService = new PetsMongoDAO();
