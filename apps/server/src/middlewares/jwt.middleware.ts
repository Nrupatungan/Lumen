import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded as {
      id: string;
      name: string;
      role: "admin" | "user";
      email: string;
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
