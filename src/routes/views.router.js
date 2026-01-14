import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();


router.get("/", (req, res) => res.redirect("/realtimeproducts"));


router.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const result = await ProductModel.paginate({}, { limit, page, lean: true });

    return res.render("home", {
      title: "Listado de productos",
      products: result.docs,

      
      limit,

      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });
  } catch (error) {
    console.error("Error al renderizar productos:", error);
    return res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await ProductModel.find().lean();

    return res.render("realtimeproducts", {
      title: "Productos en tiempo real",
      products
    });
  } catch (error) {
    console.error("Error al renderizar realtimeproducts:", error);
    return res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    const items = (cart.products || [])
      .filter((p) => p.product)
      .map((p) => {
        const price = Number(p.product.price) || 0;
        const quantity = Number(p.quantity) || 0;

        return {
          productId: p.product._id,
          title: p.product.title,
          price,
          quantity,
          subtotal: price * quantity
        };
      });

    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    return res.render("cart", {
      title: "Carrito",
      cartId: cart._id,
      items,
      total,
      hasItems: items.length > 0
    });
  } catch (error) {
    console.error("Error al renderizar carrito:", error);
    return res.status(500).send("Error interno del servidor");
  }
});

export default router;
