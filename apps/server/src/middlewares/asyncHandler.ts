// middlewares/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (
    // eslint-disable-next-line no-unused-vars
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
  ): RequestHandler =>
  (_req, _res, _next) => {
    Promise.resolve(fn(_req, _res, _next)).catch(_next);
  };
