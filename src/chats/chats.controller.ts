import {Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ChatsService} from "./chats.service";
import {Request} from "express";
import {LocalAuthGuard} from "../auth/local-auth.guard";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as path from "path";

const defaultConfig = diskStorage({
    destination: './upload',
    filename: (req: Request, file, cb) => {
        cb(null, `${new Date().getTime()}${path.extname(file.originalname)}`)
    }
})

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('voice')
    @UseInterceptors(FileInterceptor('audio', {storage: defaultConfig}))
    sendMessageVoice(@Req() req, @Body() body, @UploadedFile() file: Express.Multer.File) {
        return this.chatsService.sendMessageVoice(req['user'], body, file)
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
