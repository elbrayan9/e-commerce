import { Router } from "express";
import passport from "passport";
import { cartService } from "../repositories/index.js";
import { checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
const authMiddleware = passport.authenticate("current", { session: false });

router.post("/", async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: "Carrito no encontrado" });
  }
});

router.post(
  "/:cid/product/:pid",
  authMiddleware,
  checkRole(["user"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.addProductToCart(cid, pid);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
);

router.post("/:cid/purchase", authMiddleware, async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email;
    const { ticket, failedProducts } = await cartService.purchaseCart(
      cid,
      purchaserEmail
    );

    if (failedProducts.length > 0) {
      return res.status(207).json({
        status: "partial_success",
        message: "Algunos productos no se pudieron comprar por falta de stock.",
        payload: { ticket, failedProducts },
      });
    }
    res.json({
      status: "success",
      message: "Compra realizada con éxito",
      payload: ticket,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
