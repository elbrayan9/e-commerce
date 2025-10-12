import { Router } from "express";
import passport from "passport";
import { productService } from "../repositories/index.js";
import { checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
const authMiddleware = passport.authenticate("current", { session: false });

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };
    if (sort) options.sort = { price: sort === "asc" ? 1 : -1 };
    const filter = query ? { category: { $regex: query, $options: "i" } } : {};
    const result = await productService.getProducts(filter, options);
    res.json({ status: "success", ...result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.pid,
      req.body
    );
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete(
  "/:pid",
  authMiddleware,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      await productService.deleteProduct(req.params.pid);
      res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
);

export default router;
