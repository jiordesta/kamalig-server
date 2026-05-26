import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { CreateRestockData } from 'src/libs/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestockService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteRestock(deleteRestockData: any) {
    try {
      return;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async updateRestock(updateRestockData: any, id: number) {
    try {
      return;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async createRestock(createRestockData: CreateRestockData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const restock = await transaction.restock.create({
          data: {
            restockDate: createRestockData.restockDate,
            productId: createRestockData.productId,
            brand: createRestockData.brand,
            quantity: createRestockData.quantity,
          },
        });

        await transaction.item.create({
          data: {
            restockId: restock.id,
            quantity: createRestockData.quantity,
            productId: createRestockData.productId,
          },
        });
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async fetchAllRestocks(filters: any) {
    try {
      const restocks = await prisma.restock.findMany({
        where: filters,
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return restocks.map((restock) => {
        return {
          id: restock.id,
          restockDate: restock.restockDate,
          productId: restock.productId,
          brand: restock.brand,
          quantity: restock.quantity,
          productName: restock.product.names[0],
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
