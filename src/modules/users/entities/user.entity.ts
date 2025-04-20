import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/roles/entities/role.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'nvarchar', nullable: true, unique: true })
  username: string;

  @BeforeInsert()
  async setUsernameFromEmail() {
    if (!this.username) {
      const emailParts = this.email.split('@');
      this.username = emailParts[0];
    }
  }

  @Column({ type: 'nvarchar', unique: true })
  email: string;

  @Column({ type: 'nvarchar' })
  passwordHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }

  // async comparePassword(password: string): Promise<boolean> {
  //   return await bcrypt.compare(password, this.passwordHash);
  // }

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'nvarchar', nullable: true })
  name: string;

  @Column({ type: 'nvarchar', nullable: true })
  phone: string;

  @Column({ type: 'nvarchar', nullable: true })
  gender: Gender;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];
}
