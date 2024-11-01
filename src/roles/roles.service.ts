import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { PaginationInterface } from '../utils/Pagination';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, permissions } = createRoleDto;
    const existingRole = await this.findRoleByName(name);

    if (existingRole) {
      throw new UnprocessableEntityException('Role already exists');
    }

    return await this.roleRepository.save({ name, permissions });
  }

  async findAll(query: PaginationInterface) {
    const {
      limit = 10,
      page = 1,
      search = '',
      sort = 'id',
      order = 'ASC',
    } = query;
    const searchBy: FindOptionsWhere<Role> = {};

    if (search) {
      searchBy.name = Like(`%${search}%`);
    }

    const roles = await this.roleRepository.find({
      where: searchBy,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sort]: order },
    });

    const total = await this.roleRepository.count();

    return { roles, total };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    return await this.roleRepository.save({ id, ...updateRoleDto });
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.roleRepository.delete(id);
  }

  async findRoleByName(name: string) {
    return await this.roleRepository.findOne({ where: { name } });
  }
}
