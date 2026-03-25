import { Router } from "express";
import passport from "passport";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  createProduct
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  deleteProduct
);

export default router;