import { Request, Response } from "express";

// Criar mod
export function create(req: Request, res: Response) {
  console.log(req.body);

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  res.json({ message: "Modpack Created" });
}
