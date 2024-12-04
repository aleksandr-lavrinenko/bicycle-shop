import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use(req: any, res: any, next: () => void) {
    if (!req.cookies["sessionId"]) {
      const sessionId = uuidv4(); // Generate a unique session ID
      res.cookie("sessionId", sessionId, { httpOnly: true, secure: true }); // Store in cookies
    }
    next();
  }
}
