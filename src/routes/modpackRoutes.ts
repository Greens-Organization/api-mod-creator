import express from "express";
import { create } from "../controllers/ModpackController";

const modpackRoutes = express.Router();

modpackRoutes.post("/create", create);

export { modpackRoutes };
