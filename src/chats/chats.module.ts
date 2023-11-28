import {Module} from '@nestjs/common';
import {ChatsService} from './chats.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatsGateway} from "./chats.gateway";
import {Chats} from "./entities/chats.entity";
import { ChatsController } from './chats.controller';
import {UsersModule} from "../users/users.module";
import {GptModule} from "../gpt/gpt.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chats]),
        GptModule,
        UsersModule
    ],
    providers: [
        ChatsService,
        ChatsGateway
    ],
    exports: [
        ChatsService,
        ChatsGateway
    ],
    controllers: [ChatsController]
})
export class ChatsModule {
}
