import { Request, Response } from "express";

export function create(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  res.json({ message: "Modpack Created" });
}
