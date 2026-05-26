import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { UpdateRestockDTO } from 'src/libs/dto';
import { CreateTransactionData, UpdateTransactionData } from 'src/libs/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}
  async fetchTransactionItems(transactionId: number) {
    try {
      const transactionItems = await prisma.transactionItem.findMany({
        where: {
          transactionId: transactionId,
          isDeleted: false,
        },
        include: {
          item: {
            include: {
              product: true,
              restock: true,
            },
          },
        },
      });

      return transactionItems.map((transactionItem) => {
        return {
          id: transactionItem.id,
          quantity: transactionItem.quantity,
          productName: transactionItem.item.product.names[0],
          brand: transactionItem.item.restock.brand,
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async createTransaction(createTransactionData: CreateTransactionData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const createdTransaction = await transaction.transaction.create({
          data: {
            userId: createTransactionData.userId,
            transactionDate: createTransactionData.transactionDate,
          },
        });

        for (const transactionItem of createTransactionData.items) {
          const quantity =
            transactionItem.quantity +
            transactionItem.additional.reduce((acc, curr) => acc + curr, 0);

          await transaction.transactionItem.create({
            data: {
              transactionId: createdTransaction.id,
              itemId: transactionItem.itemId,
              quantity: quantity,
            },
          });
        }

        return createdTransaction;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async fetchAllTransactions(filters: any) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: filters,
        include: {
          transactionItem: true,
          user: {
            include: {
              userDetails: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return transactions.map((transaction) => {
        return {
          id: transaction.id,
          userId: transaction.userId,
          transactionDate: transaction.transactionDate,
          name: transaction?.user?.userDetails?.fname,
          transactionItems: transaction.transactionItem.map(
            (transactionItem) => {
              return {
                id: transactionItem.id,
                quantity: transactionItem.quantity,
                itemId: transactionItem.itemId,
                additional: [],
              };
            },
          ),
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async updateTransaction(
    updateTransactionData: UpdateTransactionData,
    transactionId: number,
  ) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        for (const transactionItem of updateTransactionData.items) {
          const quantity =
            transactionItem.quantity +
            transactionItem.additional.reduce((acc, curr) => acc + curr, 0);

          await transaction.transactionItem.update({
            where: {
              id: transactionItem.id,
              transactionId: transactionId,
            },
            data: {
              quantity: quantity,
            },
          });
        }

        return true;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
