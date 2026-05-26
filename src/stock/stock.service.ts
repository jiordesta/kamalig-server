import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prismaService: PrismaService) {}

  async setOutOfStocks(parsed: number[]) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        for (const stockId of parsed) {
          await transaction.item.update({
            where: {
              id: stockId,
            },
            data: {
              isDeleted: true,
            },
          });
        }

        return true;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async fetchAllStocks(filters: any) {
    try {
      const items = await prisma.item.findMany({
        where: filters,
        include: { product: true, restock: true },
      });

      return await Promise.all(
        items.map(async (item) => {
          const restock = item.restock;
          const product = item.product;

          const transactionItems = await prisma.transactionItem.findMany({
            where: {
              itemId: item.id,
              isDeleted: false,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          const totalOut = transactionItems.reduce(
            (acc, transactionItem) => acc + (transactionItem.quantity || 0),
            0,
          );

          const initialStock = restock?.quantity || 0;

          return {
            id: item.id,
            productId: item.productId,
            productName: product?.names?.[0] || 'Unknown Product',
            stocksLeft: initialStock - totalOut,
            totalOut: totalOut,
            brand: restock?.brand,
            quantity: initialStock,
          };
        }),
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchStockFlowItems(stockId: number) {
    try {
      const transactionItems = await prisma.transactionItem.findMany({
        where: {
          itemId: stockId,
          isDeleted: false,
        },
        include: {
          transaction: {
            include: {
              user: {
                include: {
                  userDetails: true,
                },
              },
            },
          },
        },
      });

      return transactionItems.map((transactionItem) => {
        return {
          id: transactionItem.id,
          quantity: transactionItem.quantity,
          receiver: `${transactionItem?.transaction?.user?.userDetails?.fname} ${transactionItem?.transaction?.user?.userDetails?.lname}`,
          transactionDate: transactionItem?.transaction?.transactionDate,
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
