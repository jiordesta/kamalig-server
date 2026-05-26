import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateProductDTO, UpdateProductDTO } from 'src/libs/dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @Request() req: any,
  ) {
    return await this.productService.createProduct(createProductDTO);
  }

  @Get('fetchall')
  @UseGuards(JwtAuthGuard)
  async fetchAllProducts() {
    return await this.productService.fetchAllProducts();
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Request() req: any,
    @Query('productIds') productIds: any,
  ) {
    const parsed = productIds.split(',').map(Number);
    return await this.productService.deleteProduct(parsed);
  }

  @Patch('update/:productId')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    return await this.productService.updateProduct(productId, updateProductDTO);
  }
}
