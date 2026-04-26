import { type SessionUser, getUserFromRequest } from '@affex/auth-core';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

const AUTH_SECRET = process.env.AUTH_SECRET ?? 'dev-secret-do-not-use-in-prod-32chars';
const AUTH_ISSUER = 'affex-starter-nest';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: SessionUser;
    }>();
    const user = await getUserFromRequest(
      { headers: req.headers },
      { secret: AUTH_SECRET, issuer: AUTH_ISSUER },
    );
    if (!user) throw new UnauthorizedException('login required');
    req.user = user;
    return true;
  }
}
