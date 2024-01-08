import { Request, Response } from "express";

export function index(req: Request, res: Response) {
  res.json({ message: "Hello world" });
}
