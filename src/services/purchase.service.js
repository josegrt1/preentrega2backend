import CartsRepository from "../repositories/cart.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsRepository from "../repositories/ticket.repository.js";
import crypto from "crypto";

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketsRepository = new TicketsRepository();

export default class PurchaseService {
  async purchaseCart(cid, purchaserEmail) {
    const cart = await cartsRepository.getCartByIdPopulated(cid);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (!cart.products || cart.products.length === 0) {
      throw new Error("El carrito está vacío");
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
        productFromDB.stock -= quantity;
        await productsRepository.updateProduct(productFromDB._id, {
          stock: productFromDB.stock
        });

        totalAmount += productFromDB.price * quantity;
      } else {
        productsNotProcessed.push(product._id.toString());
      }
    }

    if (totalAmount === 0) {
      return {
        status: "error",
        message: "No se pudo procesar la compra porque no hay stock suficiente",
        productsNotProcessed
      };
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
      ticket,
      productsNotProcessed
    };
  }
}