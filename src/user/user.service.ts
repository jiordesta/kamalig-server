import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/libs/db';
import { Role } from 'src/libs/enums';
import { CreateUserData, UpdateUserData } from 'src/libs/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllUsers(filters: any) {
    try {
      const users = await prisma.user.findMany({
        where: filters,
        include: {
          userRole: {
            include: {
              role: true,
            },
          },
          userCredential: true,
          userDetails: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return users.map((user) => {
        return {
          id: user.id,
          fname: user?.userDetails?.fname,
          lname: user?.userDetails?.lname,
          username: user?.userCredential?.username,
          role: user?.userRole?.role?.name,
          roleId: user?.userRole?.roleId,
        };
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createUser(data: CreateUserData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const user = await transaction.user.create({});
        await transaction.userDetails.create({
          data: {
            fname: data.fname,
            lname: data.lname,
            userId: user.id,
          },
        });

        await transaction.userRole.create({
          data: {
            userId: user.id,
            roleId: data.roleId,
          },
        });

        return user;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(data: UpdateUserData, userId: number) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        await transaction.userDetails.update({
          where: {
            userId: userId,
          },
          data: {
            fname: data.fname,
            lname: data.lname,
          },
        });

        await transaction.userRole.update({
          where: {
            userId: userId,
          },
          data: {
            roleId: data.roleId,
          },
        });

        return true;
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(selectedIds: number[]) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        for (const id of selectedIds) {
          await transaction.user.update({
            where: {
              id: id,
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
}
