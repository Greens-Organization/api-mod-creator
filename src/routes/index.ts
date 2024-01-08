import { Router } from "express";
import { accessRoutes } from "./accessRoutes";
import { authRoutes } from "./authRoutes";
import { modpackRoutes } from "./modpackRoutes";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// Auth
router.use("/auth", authRoutes);

// Modpack
router.use("/modpack", authenticate);
router.use("/modpack", modpackRoutes);

// Control Access
router.use("/access", authenticate);
router.use("/access", accessRoutes);

export default router;
