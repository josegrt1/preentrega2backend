import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const productManager = new ProductManager(
  path.join(__dirname, "..", "data", "products.json")
);

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Listado de productos",
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos para la vista:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", {
    title: "Productos en tiempo real",
  });
});

export default router;
