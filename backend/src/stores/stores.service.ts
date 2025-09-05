import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async findAll(filters?: any): Promise<any[]> {
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

    const stores = await this.storesRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      relations: ['ratings'],
    });

    // Calculate average rating for each store
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const avgRating = await this.ratingsRepository
          .createQueryBuilder('rating')
          .select('AVG(rating.rating)', 'avgRating')
          .where('rating.storeId = :storeId', { storeId: store.id })
          .getRawOne();

        return {
          ...store,
          averageRating: avgRating.avgRating ? parseFloat(avgRating.avgRating).toFixed(1) : '0.0',
          totalRatings: store.ratings?.length || 0,
        };
      })
    );

    return storesWithRatings;
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['ratings', 'ratings.user', 'owner'],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storesRepository.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }

  async getStatistics() {
    const totalStores = await this.storesRepository.count();
    return { total: totalStores };
  }

  async getStoresByOwner(ownerId: number): Promise<any[]> {
    const stores = await this.storesRepository.find({
      where: { ownerId },
      relations: ['ratings', 'ratings.user'],
    });

    return Promise.all(
      stores.map(async (store) => {
        const avgRating = await this.ratingsRepository
          .createQueryBuilder('rating')
          .select('AVG(rating.rating)', 'avgRating')
          .where('rating.storeId = :storeId', { storeId: store.id })
          .getRawOne();

        return {
          ...store,
          averageRating: avgRating.avgRating ? parseFloat(avgRating.avgRating).toFixed(1) : '0.0',
          totalRatings: store.ratings?.length || 0,
        };
      })
    );
  }
}