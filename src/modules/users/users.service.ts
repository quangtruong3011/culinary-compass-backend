import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../auth/constants/constants';
import { UpdateUserRoleResponseDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserRoles(
    userId: number,
    roleName: string,
  ): Promise<UpdateUserRoleResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.roles.push(role);
    await this.userRepository.save(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async seedRoles(): Promise<void> {
    const roles = Object.values(RoleEnum);
    for (const roleName of roles) {
      const roleExists = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!roleExists) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
    }
  }
}
