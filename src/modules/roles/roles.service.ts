import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetRoleDto } from './dto/get-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name ${createRoleDto.name} already exists`,
      );
    }

    return await this.roleRepository.save(createRoleDto);
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginationResult<GetRoleDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const [roles, total] = await this.roleRepository.findAndCount({
      where: filter ? { name: ILike(`${filter}`) } : {},
      skip: (page - 1) * limit,
      take: limit,
    });

    const results = roles.map((role) => {
      const { id, name } = role;
      return { id, name };
    });

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return { id: role.id, name: role.name };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: updateRoleDto.name },
    });

    if (existingRole && existingRole.id !== id) {
      throw new ConflictException(
        `Role with name ${updateRoleDto.name} already exists`,
      );
    }

    return await this.roleRepository.save({ ...role, ...updateRoleDto });
  }

  async remove(id: number) {
    return await this.roleRepository.softDelete(id);
  }

  async findRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }
}
