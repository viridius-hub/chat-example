import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
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

    if (!fromUser || !toUser) throw new NotFoundException()

    const translateText = toUser.lang ? await this.gptService.translate({
      text: body.text,
      lang: toUser.lang
    }) : body.text

    const isFirst = await this.chatsRepository.exist({
      where: [
        {
          from_user: {id: fromUser.id},
          to_user: {id: toUser.id}
        },
        {
          from_user: {id: toUser.id},
          to_user: {id: fromUser.id}
        }
      ]
    })

    if (!isFirst) {
      await this.chatsGateway.sendMessage([toUser.id], 'new_chat', {
        user: fromUser,
      })

      await this.chatsGateway.sendMessage([fromUser.id], 'new_chat', {
        user: toUser
      })
    }

    await this.chatsGateway.sendMessage([toUser.id], 'new_message', {
      text: translateText,
      from_user: fromUser,
      to_user: toUser
    })

    await this.chatsGateway.sendMessage([fromUser.id], 'new_message', {
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
    const messages = await this.chatsRepository.find({
      where: [
        {
          from_user: {id: user.id},
        },
        {
          to_user: {id: user.id}
        }
      ],
      relations: {from_user: true, to_user: true}
    });

    const resArr = []

    messages.map((_mess) => {
      if(_mess.to_user.id !== user.id) return {user: _mess.to_user}
      if(_mess.from_user.id !== user.id) return {user: _mess.from_user}
    }).filter(_user => (_user.user.id !== user.id)).filter(item => {
      const i = resArr.findIndex(x => (x.user.id == item.user.id));
      if (i <= -1) {
        resArr.push(item);
      }

      return null
    })

    return resArr
  }

  async getHistoryMessages(user: Users, userId: string) {
    const _user = await this.userService.findOneById(user.id)

    const messages = await this.chatsRepository.find({
      where: [
        {
          from_user: {id: _user.id},
          to_user: {id: userId}
        },
        {
          from_user: {id: userId},
          to_user: {id: _user.id}
        }
      ],
      relations: {from_user: true, to_user: true}
    });

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]

      if(_user.lang) {
        try {
          const translate = await this.gptService.translate({
            text: message.text,
            lang: _user.lang
          })

          if(translate) {
            if (message.to_user.id === user.id) {
              message.text = _user.lang ? translate : message.text
            }
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    return messages
  }
}
