import {Controller, Get, Param, Query, Req, UseGuards} from '@nestjs/common';
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

    @UseGuards(JwtAuthGuard)
    @Get('search')
    async search(@Req() req, @Query('nickname') nickname: string) {
        return this.usersService.search(req['user'], nickname)
    }
}