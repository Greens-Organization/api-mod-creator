import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/token/tokenHandler";
import User from "../database/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "adoadovceviado";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const { payload, protectedHeader } = await verifyToken(token, JWT_SECRET);

    const user = User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({ message: "Access denied. User not found" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
}
