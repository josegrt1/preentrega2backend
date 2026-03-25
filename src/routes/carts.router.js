import { Router } from "express";
import passport from "passport";
import {
  createCart,
  getAllCarts,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  emptyCart,
  purchaseCart
} from "../controllers/carts.controller.js";
import { validateCartOwner } from "../middlewares/cart-owner.middleware.js";

const router = Router();

router.post("/", passport.authenticate("current", { session: false }), createCart);
router.get("/", passport.authenticate("current", { session: false }), getAllCarts);

router.get(
  "/:cid",
  passport.authenticate("current", { session: false }),
  validateCartOwner,
  getCartById
);

router.post(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  validateCartOwner,
  addProductToCart
);

router.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  validateCartOwner,
  deleteProductFromCart
);

router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  validateCartOwner,
  emptyCart
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  validateCartOwner,
  purchaseCart
);

export default router;