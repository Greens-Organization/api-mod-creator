import express from "express";
import { createKeyAccess } from "../controllers/AccessController";

const accessRoutes = express.Router();

accessRoutes.post("/create", createKeyAccess);

export { accessRoutes };
