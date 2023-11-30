import {Injectable} from '@nestjs/common';
import {Users} from "./entities/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>,) {
    }

    async search(user: Users, text: string) {
        return await this.usersRepository.find({
            where: {
                nickname: Like(`%${text}%`)
            },
            select: {
                id: true,
                nickname: true,
                lang: true
            }
        })
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

    async create(nickname: string, password: string, lang?: string): Promise<Users> {
        return await this.usersRepository.save({
            nickname: nickname,
            password: password,
            lang: lang || 'english'
        })
    }
}
