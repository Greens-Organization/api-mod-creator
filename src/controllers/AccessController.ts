import { Request, Response } from "express";
import User from "../database/models/user";
import { createAccessKey } from "../infra/AccessControl";

export async function createKeyAccess(req: Request, res: Response) {
  const { userId, expiresIn } = req.body;

  if (!userId || !expiresIn) {
    return res.status(404).json({ message: "Fields invalid or missing" });
  }

  const user = await User.findOne({ id: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.level !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const apiKey = await createAccessKey(user._id, expiresIn);
  res.json({ apiKey });
}
