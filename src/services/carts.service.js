import crypto from "crypto";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsRepository from "../repositories/ticket.repository.js";

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketsRepository = new TicketsRepository();

export default class CartsService {
  async createCart() {
    const newCart = await cartsRepository.createCart({ products: [] });

    return {
      status: "success",
      payload: newCart
    };
  }

  async getAllCarts() {
    const carts = await cartsRepository.getAllCarts();

    return {
      status: "success",
      payload: carts
    };
  }

  async getCartById(cid) {
    const cart = await cartsRepository.getCartByIdPopulated(cid);

    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return {
      status: "success",
      payload: cart
    };
  }

  async addProductToCart(cid, pid) {
    const cart = await cartsRepository.getCartById(cid);

    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const product = await productsRepository.getProductById(pid);

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    const updatedCart = await cartsRepository.saveCart(cart);

    return {
      status: "success",
      message: "Producto agregado al carrito",
      payload: updatedCart
    };
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await cartsRepository.getCartById(cid);

    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.statusCode = 404;
      throw error;
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    const updatedCart = await cartsRepository.saveCart(cart);

    return {
      status: "success",
      message: "Producto eliminado del carrito",
      payload: updatedCart
    };
  }

  async emptyCart(cid) {
    const cart = await cartsRepository.getCartById(cid);

    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.statusCode = 404;
      throw error;
    }

    cart.products = [];

    const updatedCart = await cartsRepository.saveCart(cart);

    return {
      status: "success",
      message: "Carrito vaciado correctamente",
      payload: updatedCart
    };
  }

  async purchaseCart(cid, purchaserEmail) {
    const cart = await cartsRepository.getCartByIdPopulated(cid);

    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!cart.products || cart.products.length === 0) {
      const error = new Error("El carrito está vacío");
      error.statusCode = 400;
      throw error;
    }

    const productsNotProcessed = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (!product) {
        continue;
      }

      const productFromDB = await productsRepository.getProductById(product._id);

      if (!productFromDB) {
        productsNotProcessed.push(product._id.toString());
        continue;
      }

      if (productFromDB.stock >= quantity) {
        const newStock = productFromDB.stock - quantity;

        await productsRepository.updateProduct(productFromDB._id, {
          stock: newStock
        });

        totalAmount += productFromDB.price * quantity;
      } else {
        productsNotProcessed.push(product._id.toString());
      }
    }

    if (totalAmount === 0) {
      const error = new Error("No se pudo procesar la compra porque no hay stock suficiente");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await ticketsRepository.createTicket({
      code: `TICKET-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      amount: totalAmount,
      purchaser: purchaserEmail
    });

    cart.products = cart.products.filter((item) => {
      const productId = item.product._id.toString();
      return productsNotProcessed.includes(productId);
    });

    await cartsRepository.saveCart(cart);

    return {
      status: "success",
      message: "Compra realizada con éxito",
      payload: {
        ticket,
        productsNotProcessed
      }
    };
  }
}