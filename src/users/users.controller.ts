import {Body, Controller, Get, Param, Put, Query, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUser(@Req() req) {
        return await this.usersService.findOne(req['user'].nickname)
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Req() req, @Body('lang') lang: string) {
        return await this.usersService.updateLang(req['user'].id, lang)
    }

    @UseGuards(JwtAuthGuard)
    @Get('search')
    async search(@Req() req, @Query('nickname') nickname: string) {
        return this.usersService.search(req['user'], nickname)
    }
}