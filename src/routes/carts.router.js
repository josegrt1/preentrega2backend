import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });

    return res.status(201).json({
      status: "success",
      message: "Carrito creado",
      payload: newCart
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().lean();
    return res.status(200).json({
      status: "success",
      payload: carts
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    return res.status(200).json({
      status: "success",
      payload: cart
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});


router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }


    const productExists = await ProductModel.findById(pid).lean();
    if (!productExists) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    const index = cart.products.findIndex((p) => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Producto agregado al carrito",
      payload: cart
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    const before = cart.products.length;
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    if (cart.products.length === before) {
      return res.status(404).json({
        status: "error",
        message: "El producto no estaba en el carrito"
      });
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: cart
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});


router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Carrito vaciado",
      payload: cart
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
