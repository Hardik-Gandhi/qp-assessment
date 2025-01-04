import { Router } from "express";
import Paths from "./common/path";
import AuthRoutes from "../routes/auth";
import ProtectedRoutes from "../routes/protected";
import { authenticateJwt } from "../middlewares/authentication.middleware";

const router = Router();

router.use(Paths.publicRoutes.authRoutes.base, AuthRoutes)

// Add ProtectedRoutes
router.use(Paths.protectedRoutes.base, authenticateJwt, ProtectedRoutes);

export default router;
