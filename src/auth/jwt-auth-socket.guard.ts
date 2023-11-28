import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthSocketGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()

        if (!request?.headers) request.headers = {}

        if (!request?.headers?.authorization) {
            if (request?.handshake?.auth?.token)
                request.headers.authorization = request.handshake.auth.token
        }

        return super.canActivate(context)
    }
}