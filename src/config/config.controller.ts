import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('fetchproductlist')
  async fetchProductList() {
    return await this.configService.fetchProductList();
  }

  @Get('fetchitemlist')
  async fetchItemList() {
    return await this.configService.fetchItemList();
  }

  @Get('fetchshopowners')
  async fetchStockList() {
    return await this.configService.fetchShopOwners();
  }

  @Get('fetchroles')
  async fetchRoles() {
    return await this.configService.fetchRoles();
  }
}
