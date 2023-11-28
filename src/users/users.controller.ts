import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUser(@Req() req) {
        return req['user']
    }
}