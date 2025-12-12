import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      message: "Carrito creado",
      cart: newCart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json({ products: cart.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    res.status(200).json({
      message: "Producto agregado al carrito",
      cart: updatedCart
    });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

export default router;
