import { Router } from "express";
import { accessRoutes } from "./accessRoutes";
import { authRoutes } from "./authRoutes";
import { mainRoutes } from "./mainRoutes";
import { modpackRoutes } from "./modpackRoutes";

const router = Router();

router.use("/", mainRoutes);
router.use("/auth", authRoutes);
router.use("/modpack", modpackRoutes);
router.use("/access", accessRoutes);

export default router;
