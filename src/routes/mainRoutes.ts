import express from "express";
import { index } from "../controllers/MainController";

const mainRoutes = express.Router();

mainRoutes.get("/", index);

export { mainRoutes };
