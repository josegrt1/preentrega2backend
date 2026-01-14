import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();


async function emitUpdatedProducts(req) {
  const io = req.app.get("io");
  if (!io) return;

  const products = await ProductModel.find().lean();
  io.emit("updatedProducts", products);
}

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    let sort = undefined;
    if (req.query.sort === "asc") sort = { price: 1 };
    if (req.query.sort === "desc") sort = { price: -1 };

    let filter = {};
    if (req.query.query) {
      const q = String(req.query.query).toLowerCase();

      if (q === "true" || q === "false") {
        filter.status = q === "true";
      } else {
        filter.category = req.query.query;
      }
    }

    const result = await ProductModel.paginate(filter, {
      limit,
      page,
      sort,
      lean: true
    });

    
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (req.query.query) params.set("query", String(req.query.query));
    if (req.query.sort) params.set("sort", String(req.query.sort));

    const prevParams = new URLSearchParams(params);
    prevParams.set("page", String(result.prevPage));

    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(result.nextPage));

    return res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?${prevParams.toString()}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?${nextParams.toString()}` : null
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductModel.findById(pid).lean();
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    return res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    
    const { title, description, price, category, code, stock } = req.body || {};
    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      !code ||
      stock === undefined
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Faltan campos obligatorios: title, description, price, category, code, stock"
      });
    }

    const created = await ProductModel.create(req.body);

    
    await emitUpdatedProducts(req);

    return res.status(201).json({
      status: "success",
      message: "Producto creado correctamente",
      payload: created
    });
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const updated = await ProductModel.findByIdAndUpdate(pid, req.body, {
      new: true,
      runValidators: true
    }).lean();

    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    
    await emitUpdatedProducts(req);

    return res.status(200).json({
      status: "success",
      message: "Producto actualizado",
      payload: updated
    });
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const deleted = await ProductModel.findByIdAndDelete(pid).lean();
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    
    await emitUpdatedProducts(req);

    return res.status(200).json({
      status: "success",
      message: "Producto eliminado",
      payload: deleted
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
