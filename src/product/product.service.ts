import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { CreateProductData, UpdateProductData } from 'src/libs/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(createProductData: CreateProductData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const product = await transaction.product.create({
          data: {
            names: createProductData.names,
          },
        });

        return product;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchProductById(productId: number) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          isDeleted: false,
          id: productId,
        },
      });

      return product;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchAllProducts() {
    try {
      const products = await prisma.product.findMany({
        where: {
          isDeleted: false,
        },
      });

      return products.map((product) => ({
        id: product.id,
        productName: product.names[0],
        otherNames: product.names.slice(1),
        names: product.names,
      }));
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteProduct(productIds: number[]) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        for (const productId of productIds) {
          await transaction.product.update({
            where: {
              id: productId,
            },
            data: {
              isDeleted: true,
            },
          });
        }
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProduct(productId: number, updateProductData: UpdateProductData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        await transaction.product.update({
          where: {
            id: productId,
          },
          data: {
            names: updateProductData.names,
          },
        });
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
