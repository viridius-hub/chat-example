import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne,
} from 'typeorm';
import {Users} from "../../users/entities/users.entity";

@Entity('chats')
export class Chats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users, _user => _user.id, {nullable: true})
    @JoinColumn({name: "to_user_id"})
    to_user: Users;

    @ManyToOne(() => Users, _user => _user.id, {nullable: true})
    @JoinColumn({name: "from_user_id"})
    from_user: Users;

    @Column({nullable: true})
    text: string;

    @Column({nullable: true})
    audio: string;

    @Column({nullable: true})
    original_audio: string;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}