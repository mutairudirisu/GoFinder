import type { Request, Response, NextFunction } from 'express';

// example express middleware stub
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // inspect token/cookie, attach user to req
  next();
}
