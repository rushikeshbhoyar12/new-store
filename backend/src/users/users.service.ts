import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Password should already be hashed when coming from auth service
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(filters?: any): Promise<User[]> {
    const whereConditions: any = {};
    
    if (filters?.name) {
      whereConditions.name = Like(`%${filters.name}%`);
    }
    if (filters?.email) {
      whereConditions.email = Like(`%${filters.email}%`);
    }
    if (filters?.address) {
      whereConditions.address = Like(`%${filters.address}%`);
    }
    if (filters?.role) {
      whereConditions.role = filters.role;
    }

    return this.usersRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      relations: ['stores'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['stores', 'ratings'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async getStatistics() {
    const totalUsers = await this.usersRepository.count();
    const adminUsers = await this.usersRepository.count({ where: { role: UserRole.ADMIN } });
    const normalUsers = await this.usersRepository.count({ where: { role: UserRole.USER } });
    const storeOwners = await this.usersRepository.count({ where: { role: UserRole.STORE_OWNER } });

    return {
      total: totalUsers,
      admins: adminUsers,
      users: normalUsers,
      storeOwners,
    };
  }
}