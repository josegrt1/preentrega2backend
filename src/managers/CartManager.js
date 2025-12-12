import { promises as fs } from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getCarts() {
    return await this.#readFile();
  }

  async createCart() {
    const carts = await this.#readFile();

    const newId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await this.#writeFile(carts);

    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.#readFile();
    return carts.find((c) => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.#readFile();

    const cartIndex = carts.findIndex((c) => String(c.id) === String(cid));
    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado");
    }

    const cart = carts[cartIndex];

    
    const productInCart = cart.products.find(
      (p) => String(p.product) === String(pid)
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    carts[cartIndex] = cart;
    await this.#writeFile(carts);

    return cart;
  }
}
