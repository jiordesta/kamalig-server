import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { Role } from 'src/libs/enums';

@Injectable()
export class ConfigService {
  async fetchRoles() {
    try {
      const roles = await prisma.role.findMany({});

      return roles;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async fetchProductList() {
    try {
      const products = await prisma.product.findMany({
        where: {
          isDeleted: false,
        },
      });

      return products.map((product) => ({
        id: product.id,
        productName: product.names[0],
      }));
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchItemList() {
    try {
      const items = await prisma.item.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          product: true,
          restock: true,
        },
      });

      return await Promise.all(
        items.map(async (item) => {
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

          return {
            id: item.id,
            productId: item.productId,
            productName: item.product.names[0],
            brand: item.restock?.brand,
            quantity: item.quantity - totalOut,
          };
        }),
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchShopOwners() {
    try {
      const shopOwners = await prisma.user.findMany({
        where: {
          isDeleted: false,
          userRole: {
            roleId: Role.SHOPMANAGER,
          },
        },
        include: {
          userDetails: true,
        },
      });

      return shopOwners.map((shopOwner) => ({
        id: shopOwner.id,
        name: shopOwner.userDetails?.fname + ' ' + shopOwner.userDetails?.lname,
      }));
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
