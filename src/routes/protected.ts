import { Router } from "express";
import Paths from "./common/path";
import InventoryRoutes from "../routes/inventory";
import OrderRoutes from "../routes/order";

const router = Router();

// Add ProtectedRoutes
router.use(Paths.protectedRoutes.inventoryRoutes.base, InventoryRoutes);
router.use(Paths.protectedRoutes.orderRoutes.base, OrderRoutes);

export default router;
