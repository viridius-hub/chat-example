import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from "@nestjs/jwt";
import {Users} from "../users/entities/users.entity";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {
    }

    async validateUser(nickname: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(nickname);
        if (user && user.password === password) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async registrationUser(body: { nickname: string, password: string }) {
        const user = await this.usersService.create(body.nickname, body.password)
        return {
            access_token: this.jwtService.sign({id: user.id, nickname: user.nickname}),
        };
    }

    async loginUser(user: Users) {
        const _user = await this.usersService.findOne(user.nickname)
        return {
            access_token: this.jwtService.sign({id: _user.id, nickname: _user.nickname}),
        };
    }
}