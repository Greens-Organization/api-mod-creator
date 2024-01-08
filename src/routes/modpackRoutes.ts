import express from "express";
import { create } from "../controllers/ModpackController";

const modpackRoutes = express.Router();

modpackRoutes.get("/create", create);

export { modpackRoutes };
