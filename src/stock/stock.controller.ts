import {
  Controller,
  Delete,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('fetchall')
  async fetchAllStocks(
    @Query('productId', new ParseIntPipe({ optional: true }))
    productId?: number,
    @Query('isDeleted', new ParseBoolPipe({ optional: true }))
    isDeleted?: boolean,
  ) {
    let filters = {
      isDeleted: isDeleted,
    };

    if (productId) filters['productId'] = productId;

    return await this.stockService.fetchAllStocks(filters);
  }

  @Get('flow')
  async fetchStockFlowItems(@Query('stockId', ParseIntPipe) stockId: number) {
    return await this.stockService.fetchStockFlowItems(stockId);
  }

  @Delete('setoutstock')
  async setOutOfStocks(@Query('selectedIds') selectedIds: any) {
    const parsed = selectedIds.split(',').map(Number);
    return await this.stockService.setOutOfStocks(parsed);
  }
}
