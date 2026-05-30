import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { CreateReportData } from 'src/libs/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllReports() {
    try {
      return await prisma.report.findMany({
        where: { isDeleted: false },
        include: {
          reportItem: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createReport(createReportData: CreateReportData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const report = await transaction.report.create({
          data: {
            reportDate: createReportData.reportDate,
          },
        });

        for (const reportItem of createReportData.items) {
          const quantity =
            reportItem.quantity +
            reportItem.additional.reduce((acc, curr) => acc + curr, 0);

          const item = await transaction.item.findUnique({
            where: {
              id: reportItem.itemId,
            },
            include: {
              transactionItem: {
                where: {
                  transaction: {
                    transactionDate: new Date(createReportData.reportDate),
                  },
                },
              },
            },
          });

          const totalOut = item?.transactionItem?.reduce(
            (acc, transactionItem) => acc + (transactionItem.quantity || 0),
            0,
          );

          await transaction.reportItem.create({
            data: {
              reportId: report.id,
              itemId: reportItem.itemId,
              itemQuantity: item.quantity - totalOut,
              reportQuantity: quantity,
            },
          });
        }

        return report;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async displayReport(reportId: number) {
    try {
      const report = await prisma.report.findUnique({
        where: {
          id: reportId,
        },
        include: {
          reportItem: {
            include: {
              item: {
                include: {
                  product: true,
                  restock: true,
                },
              },
            },
          },
        },
      });

      return report?.reportItem.map((reportItem) => {
        return {
          id: reportItem.id,
          itemId: reportItem.itemId,
          productName: reportItem.item.product.names[0],
          brand: reportItem.item.restock.brand,
          itemQuantity: reportItem.itemQuantity,
          reportQuantity: reportItem.reportQuantity,
          match: reportItem.itemQuantity === reportItem.reportQuantity,
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
