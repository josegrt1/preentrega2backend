import { ProductModel } from "../../models/product.model.js";

export default class ProductsDAO {
  async paginate(filter, options) {
    return await ProductModel.paginate(filter, options);
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async getAllLean() {
    return await ProductModel.find().lean();
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}