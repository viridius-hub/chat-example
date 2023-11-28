import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {AuthController} from './auth.controller';
import {JwtStrategy} from "./jwt.strategy";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {LocalStrategy} from "./local.strategy";
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtModule} from "@nestjs/jwt";
import {JwtAuthSocketGuard} from "./jwt-auth-socket.guard";

@Module({
    imports: [UsersModule, JwtModule.register({
        secret: "secret",
        signOptions: {expiresIn: '7d'},
    }),],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy, LocalAuthGuard, JwtAuthSocketGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy, LocalAuthGuard, JwtAuthSocketGuard]
})
export class AuthModule {
}
