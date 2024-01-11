import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const accessToken: string = request.headers.authorization.split(' ')[1];
      const decoded = this.jwt.decode(accessToken);

      if (decoded) {
        const user = await this.userService.findUserByEmail(decoded['email']);
        delete user.password;
        delete user.refreshToken;
        request.user = user;
        console.log('user', user);
      }
    }

    return next.handle();
  }
}
