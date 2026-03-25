import { CartModel } from "../../models/cart.model.js";

export default class CartsDAO {
  async create(cartData = { products: [] }) {
    return await CartModel.create(cartData);
  }

  async getById(id) {
    return await CartModel.findById(id);
  }

  async getByIdPopulated(id) {
    return await CartModel.findById(id).populate("products.product");
  }

  async getAll() {
    return await CartModel.find().lean();
  }

  async save(cart) {
    return await cart.save();
  }
}