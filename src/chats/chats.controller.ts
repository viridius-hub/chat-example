import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {ChatsService} from "./chats.service";
import {Request} from "express";
import {LocalAuthGuard} from "../auth/local-auth.guard";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    sendMessage(@Req() req, @Body() body) {
        return this.chatsService.sendMessage(req['user'], body)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getChats(@Req() req) {
        return this.chatsService.getHistoryChats(req['user'])
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    getMessages(@Req() req, @Param('userId') userId: string) {
        return this.chatsService.getHistoryMessages(req['user'], userId)
    }
}
