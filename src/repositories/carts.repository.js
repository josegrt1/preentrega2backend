import CartsDAO from "../dao/mongo/carts.dao.js";

const cartsDAO = new CartsDAO();

export default class CartsRepository {
  async createCart(cartData) {
    return await cartsDAO.create(cartData);
  }

  async getCartById(id) {
    return await cartsDAO.getById(id);
  }

  async getCartByIdPopulated(id) {
    return await cartsDAO.getByIdPopulated(id);
  }

  async getAllCarts() {
    return await cartsDAO.getAll();
  }

  async saveCart(cart) {
    return await cartsDAO.save(cart);
  }
}