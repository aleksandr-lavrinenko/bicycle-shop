/* eslint-disable @typescript-eslint/no-namespace */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any; // Optional: Add other fields if needed
      };
    }
  }
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      req.user = undefined;
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid authorization header format");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.jwtService.verify(token); // Verify JWT
      req.user = decoded; // Attach user to the request object
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
    next();
  }
}
