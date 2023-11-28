import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from "express";
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./local-auth.guard";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('registration')
    registration(@Req() req: Request, @Body() body: any) {
        return this.authService.registrationUser(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request, @Body() body: any) {
        return this.authService.loginUser(body)
    }
}
