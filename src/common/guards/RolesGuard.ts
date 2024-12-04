import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request["user"];

    if (!user) {
      if (this.allowedRoles.length === 0) {
        return true;
      } else {
        throw new ForbiddenException(
          "You must be logged in to access this resource"
        );
      }
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        "You do not have permission to perform this action"
      );
    }
    return true;
  }
}
