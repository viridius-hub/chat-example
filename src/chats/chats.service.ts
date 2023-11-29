import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Chats} from "./entities/chats.entity";
import {Users} from "../users/entities/users.entity";
import {ChatsGateway} from "./chats.gateway";
import {UsersService} from "../users/users.service";
import {GptService} from "../gpt/gpt.service";

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chats) private chatsRepository: Repository<Chats>,
        private readonly chatsGateway: ChatsGateway,
        private readonly userService: UsersService,
        private readonly gptService: GptService,
    ) {
    }

    async sendMessage(user: Users, body: { to_user: string, text?: string }): Promise<Chats> {
        const fromUser = await this.userService.findOneById(user.id)
        const toUser = await this.userService.findOneById(body.to_user)

        if(!fromUser || !toUser) throw new NotFoundException()

        // console.log(await this.gptService.translate({
        //     text: body.text,
        //     lang: 'ru'
        // }))

        await this.chatsGateway.sendMessage([toUser.id, fromUser.id], {
            text: body.text,
            from_user: fromUser,
            to_user: toUser
        })

        return await this.chatsRepository.save({
            text: body.text,
            from_user: {id: fromUser.id},
            to_user: {id: toUser.id}
        });
    }

    async getHistoryChats(user: Users) {
        return await this.chatsRepository.find({
            where: [
                {from_user: {id: user.id}},
                {to_user: {id: user.id}}
            ],
            relations: {from_user: true, to_user: true}
        });
    }

    async getHistoryMessages(user: Users, userId: string) {
        return await this.chatsRepository.find({
            where: [
                {
                    from_user: [
                        {
                            id: userId,
                        },
                        {
                            id: user.id
                        }
                    ]
                },
                {
                    to_user: [
                        {
                            id: userId
                        }, {
                            id: user.id
                        }
                    ]
                },
            ],
            relations: {from_user: true, to_user: true}
        });
    }
}
