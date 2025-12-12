import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");


router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({
      message: "Producto creado correctamente",
      product: newProduct
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);

    res.status(200).json({
      message: "Producto actualizado",
      product: updatedProduct
    });
  } catch (error) {
    if (error.message === "Producto no encontrado.") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});


router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedList = await productManager.deleteProductById(pid);

    res.status(200).json({
      message: "Producto eliminado",
      products: updatedList
    });
  } catch (error) {
    if (error.message === "Producto no encontrado.") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

export default router;
