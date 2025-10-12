import { CartModel } from "../../models/cart.model.js";

export class CartsMongoDAO {
  async getById(id) {
    return await CartModel.findById(id).lean();
  }
  async create() {
    return await CartModel.create({ products: [] });
  }
  async update(id, cartData) {
    return await CartModel.findByIdAndUpdate(id, cartData, { new: true });
  }
}
