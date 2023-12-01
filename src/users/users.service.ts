import {Injectable} from '@nestjs/common';
import {Users} from "./entities/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>,) {
    }

    async search(user: Users, text: string) {
        return  await this.usersRepository.createQueryBuilder('user')
          .where("user.nickname like LOWER(:name)", { name:`%${text.toLowerCase()}%` })
          .select(['user.id', 'user.nickname', 'user.lang'])
          .getMany();
    }

    async findOneById(id: string): Promise<Users> {
        return await this.usersRepository.findOne({
            where: {
                id: id
            },
            select: {
                id: true,
                password: true,
                nickname: true,
                lang: true
            }
        })
    }

    async findOne(nickname: string): Promise<Users> {
        return await this.usersRepository.findOne({
            where: {
                nickname: nickname
            },
            select: {
                id: true,
                password: true,
                nickname: true
            }
        })
    }

    async updateLang(id: string, lang: string) {
        await this.usersRepository.update({id: id}, {
            lang: lang
        })
    }

    async create(nickname: string, password: string, lang?: string): Promise<Users> {
        return await this.usersRepository.save({
            nickname: nickname,
            password: password,
            lang: lang || 'english'
        })
    }
}
