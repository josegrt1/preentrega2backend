import CartsService from "../services/carts.service.js";

const cartsService = new CartsService();

export const createCart = async (req, res) => {
  try {
    const result = await cartsService.createCart();
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const result = await cartsService.getAllCarts();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const result = await cartsService.getCartById(req.params.cid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const result = await cartsService.addProductToCart(req.params.cid, req.params.pid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const result = await cartsService.deleteProductFromCart(req.params.cid, req.params.pid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const result = await cartsService.emptyCart(req.params.cid);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email;

    const result = await cartsService.purchaseCart(cid, purchaserEmail);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};