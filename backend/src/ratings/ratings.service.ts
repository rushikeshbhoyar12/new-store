import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const existingRating = await this.ratingsRepository.findOne({
      where: {
        userId: createRatingDto.userId,
        storeId: createRatingDto.storeId,
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }

    const rating = this.ratingsRepository.create(createRatingDto);
    return this.ratingsRepository.save(rating);
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingsRepository.find({
      relations: ['user', 'store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { userId },
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStore(storeId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserRatingForStore(userId: number, storeId: number): Promise<Rating | null> {
    return this.ratingsRepository.findOne({
      where: { userId, storeId },
    });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    
    Object.assign(rating, updateRatingDto);
    return this.ratingsRepository.save(rating);
  }

  async updateUserStoreRating(userId: number, storeId: number, newRating: number): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { userId, storeId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    rating.rating = newRating;
    return this.ratingsRepository.save(rating);
  }

  async remove(id: number): Promise<void> {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    await this.ratingsRepository.remove(rating);
  }

  async getStatistics() {
    const totalRatings = await this.ratingsRepository.count();
    return { total: totalRatings };
  }
}