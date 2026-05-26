import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RestockService } from './restock.service';
import { CreateRestockDTO } from 'src/libs/dto';

@Controller('restock')
export class RestockController {
  constructor(private readonly restockService: RestockService) {}

  @Get('fetchall')
  async fetchAllRestocks(
    @Query('productId', new ParseIntPipe({ optional: true }))
    productId?: number,
  ) {
    let filters = {
      isDeleted: false,
    };

    if (productId) {
      filters['productId'] = productId;
    }

    return await this.restockService.fetchAllRestocks(filters);
  }

  @Post('create')
  async createRestock(@Body() createRestockDTO: CreateRestockDTO) {
    return await this.restockService.createRestock(createRestockDTO);
  }

  @Patch('update/:restockId')
  async updateRestock(updateRestockData: any, id: number) {
    return await this.restockService.updateRestock(updateRestockData, id);
  }

  @Delete('delete')
  async deleteRestock(deleteRestockData: any) {
    return await this.restockService.deleteRestock(deleteRestockData);
  }
}
