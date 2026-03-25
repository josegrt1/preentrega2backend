import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export const getProducts = async (req, res) => {
  try {
    const result = await productsService.getProducts(req.query, req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await productsService.getProductById(req.params.pid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const result = await productsService.createProduct(req.body);
    await productsService.emitUpdatedProducts(req);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const result = await productsService.updateProduct(req.params.pid, req.body);
    await productsService.emitUpdatedProducts(req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await productsService.deleteProduct(req.params.pid);
    await productsService.emitUpdatedProducts(req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};