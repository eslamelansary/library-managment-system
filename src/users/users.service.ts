import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { encodePassword } from './utils/bcrypt';
import { PaginationInterface } from '../utils/Pagination';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, role_id, password } = createUserDto;

    const isExistingUser = await this.findByEmail(email);
    if (isExistingUser) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }

    await this.rolesService.findOne(role_id);
    const hashedPassword: string = await encodePassword(password);
    return await this.userRepository.save({
      name,
      email,
      role_id,
      password: hashedPassword,
    });
  }

  async findAll(query: PaginationInterface) {
    const {
      limit = 10,
      page = 1,
      search = '',
      sort = 'id',
      order = 'ASC',
    } = query;

    const searchBy = search
      ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
      : {};

    const users = await this.userRepository.find({
      where: searchBy,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sort]: order },
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        role: {
          name: true,
        },
      },
    });

    const total = await this.userRepository.count();

    return { users, total };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.userRepository.save({ id, ...updateUserDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepository.softDelete({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getMyBorrowedBooks(id: number) {
    await this.findOne(id);
    const userBooks = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.borrowedBooks', 'borrowedBooks')
      .leftJoinAndSelect('borrowedBooks.book', 'book')
      .where('user.id = :id', { id })
      .andWhere('borrowedBooks.status = :status', { status: 'BORROWED' })
      .getOne();
    const borrowed = userBooks.borrowedBooks.map((book) => book);
    return borrowed.map((book) => book.book);
  }
}
