import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import {GptModule} from "./gpt/gpt.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload')
    }),
    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) | 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    GptModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
