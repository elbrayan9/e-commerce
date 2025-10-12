import { ProductModel } from "../../models/product.model.js";

export class ProductsMongoDAO {
  async getAll(filter = {}, options = {}) {
    return await ProductModel.paginate(filter, options);
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
