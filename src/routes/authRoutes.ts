import express from "express";
import {
  signIn,
  signUp,
  recoverPassword,
  renewAccessToken,
} from "../controllers/AuthController";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.put("/renew", renewAccessToken);
authRoutes.post("/recover-password", recoverPassword);

export { authRoutes };
