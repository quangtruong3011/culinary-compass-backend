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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Booking } from 'src/modules/bookings/entities/booking.entity';

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'nvarchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'nvarchar' })
  passwordHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  phone: string;

  @Column({ type: 'nvarchar', enum: Gender, nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  birthOfDate: Date;

  @Column({ type: 'nvarchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ManyToMany(() => Comment, (comment) => comment.users)
  comments: Comment[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
