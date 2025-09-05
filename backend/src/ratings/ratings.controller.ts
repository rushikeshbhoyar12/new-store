import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('ratings')
@UseGuards(AuthGuard('jwt'))
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    return this.ratingsService.create({
      ...createRatingDto,
      userId: req.user.userId,
    });
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('my-ratings')
  getMyRatings(@Request() req) {
    return this.ratingsService.findByUser(req.user.userId);
  }

  @Get('store/:storeId')
  getRatingsByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(+storeId);
  }

  @Get('user-store-rating')
  getUserStoreRating(@Query('storeId') storeId: string, @Request() req) {
    return this.ratingsService.findUserRatingForStore(req.user.userId, +storeId);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStatistics() {
    return this.ratingsService.getStatistics();
  }

  @Patch('user-store-rating')
  updateUserStoreRating(@Body() body: { storeId: number; rating: number }, @Request() req) {
    return this.ratingsService.updateUserStoreRating(req.user.userId, body.storeId, body.rating);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
}