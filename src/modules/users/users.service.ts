import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { In, Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../auth/constants/constants';
import { UpdateUserRoleResponseDto } from './dto/update-user-role.dto';
import { User } from './entities/user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { console } from 'inspector';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const roles = await this.roleRepository.findBy({
      name: In(createUserDto.roles),
    });

    if (roles.length !== createUserDto.roles.length) {
      throw new BadRequestException('Invalid roles provided');
    }

    const userToCreate = {
      ...createUserDto,
      roles,
    };

    const user = this.userRepository.create(userToCreate);
    return await this.userRepository.save(user);
  }

  async findOne(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      birthOfDate: user.birthOfDate,
      imageUrl: user.imageUrl,
      roles: user.roles ? user.roles.map((role) => role.name) : [],
    };
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('User not found');

    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const isBase64Image = updateUserDto.imageUrl?.startsWith('data:image/');

    let imageUploadResult;
    if (updateUserDto.imageUrl && isBase64Image) {
      const tempFilePath = path.join(tempDir, `${uuidv4()}.jpg`);
      const base64Data = updateUserDto.imageUrl.replace(
        /^data:image\/jpeg;base64,/,
        '',
      );
      try {
        await fs.promises.writeFile(tempFilePath, base64Data, 'base64');
        imageUploadResult =
          await this.cloudinaryService.uploadLocalFile(tempFilePath);
        await promisify(fs.unlink)(tempFilePath);
      } catch (error) {
        console.error('Error uploading image:', error);
        await promisify(fs.unlink)(tempFilePath).catch(() => {});
        throw new BadRequestException('Invalid file type');
      }
    }

    if (imageUploadResult) {
      updateUserDto.imageUrl = imageUploadResult.secure_url;
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);

    const savedUser = await this.userRepository.save(updatedUser);

    return {
      ...savedUser,
      roles: savedUser.roles.map((role) => role.name),
    };
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
