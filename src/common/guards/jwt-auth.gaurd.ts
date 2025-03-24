import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('JWT Guard - Request Headers:', request.headers); // ✅ Debug JWT extraction
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('JWT Guard - Error:', err);
      console.error('JWT Guard - Info:', info);
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('JWT Guard - Authenticated User:', user); // ✅ Debug user extraction
    return user;
  }
}
