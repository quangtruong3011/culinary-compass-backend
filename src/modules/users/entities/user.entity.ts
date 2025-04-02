import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'nvarchar', length: 256, nullable: true, unique: true })
  username: string;

  @Column({ type: 'nvarchar', length: 256, unique: true })
  email: string;

  @Column({ type: 'nvarchar' })
  passwordHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  // @CreateDateColumn({ type: 'timestamp' })
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  // @UpdateDateColumn({ type: 'timestamp' })
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;

  // @DeleteDateColumn({ type: 'timestamp' })
  // @Column({ type: 'timestamp', nullable: true })
  // deletedAt: Date;

  @Column({ type: 'bit', default: false })
  isDeleted: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}
