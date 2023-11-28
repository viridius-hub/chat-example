import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    nickname: string;

    @Column()
    password: string;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}