import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger, UseGuards} from "@nestjs/common";
import {Users} from "../users/entities/users.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {JwtAuthSocketGuard} from "../auth/jwt-auth-socket.guard";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatsGateway {
    private connectUsers: Map<string, string[]> = new Map();
    private logger: Logger = new Logger(ChatsGateway.name);
    @WebSocketServer() server: Server;

    constructor() {
    }

    public sendMessage(ids: string[], event: any) {

        const _ids: string[] = []
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            const connections = this.getConnectsToUser(id.toString())
            console.log(connections)

            for (let j = 0; j < connections.length; j++) {
                const connection = connections[j]
                _ids.push(connection)
            }
        }

        this.server
            .to(_ids)
            .emit('new_message', event);
    }

    /* Get connects socket by User */
    public getConnectsToUser(id: string) {
        return this.connectUsers.get(id) || []
    }

    /* Has connect socket */
    public connectToIo(id: string, idIO: string) {
        const getConnectUser = this.connectUsers.get(id)

        if (getConnectUser && getConnectUser.length >= 0) {
            this.connectUsers.set(id, [...getConnectUser, idIO])
        } else {
            this.connectUsers.set(id, [idIO])
        }
    }

    /* Has disconnect socket */
    public disconnectToIo(id: string, idIO: string) {
        const getConnectUser = this.connectUsers.get(id)

        if (getConnectUser && getConnectUser.length >= 0) {
            const newConnectionsArray = getConnectUser.filter((_idIO) => idIO !== _idIO)

            if (newConnectionsArray.length >= 0) {
                this.connectUsers.set(id, newConnectionsArray)
            } else {
                this.connectUsers.delete(id)
            }
        } else {
            this.connectUsers.delete(id)
        }
    }

    @UseGuards(JwtAuthSocketGuard)
    @SubscribeMessage('subscribe')
    handleSubscribe(client: Socket): void {
        const user: Users = client['user']

        if (user) {
            this.connectToIo(user.id.toString(), client.id)
            this.logger.log(`Subscription done: ${user.id.toString()} - ${client.id}`);
        }
    }

    @UseGuards(JwtAuthSocketGuard)
    handleDisconnect(client: Socket) {
        const user: Users = client['user']
        if (user) {
            this.disconnectToIo(user.id.toString(), client.id)
            this.logger.log(`Client disconnected: ${client.id}`);
        }
    }
}