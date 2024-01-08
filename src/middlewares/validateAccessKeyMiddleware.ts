import { Request, Response, NextFunction } from "express";
import { validateAccessKey } from "../infra/AccessControl";

export async function validateAccessKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey || !(await validateAccessKey(apiKey))) {
      return res.status(401).json({ message: "Invalid or expired API key" });
    }

    next();
  } catch (error) {
    console.error("Error in API key validation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
