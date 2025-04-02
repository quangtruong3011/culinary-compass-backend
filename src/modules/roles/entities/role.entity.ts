import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles, { eager: true })
  users: User[];
}
