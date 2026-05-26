import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ONEWEEK } from 'src/libs/constants';
import { prisma } from 'src/libs/db';
import { Role } from 'src/libs/enums';
import { LoginUserData, RegisterUserData } from 'src/libs/types';
import { createHashedPassword } from 'src/libs/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async configureApp(transaction: any) {
    const roleKeys = Object.keys(Role).filter((key) => isNaN(Number(key)));
    for (const roleKey of roleKeys) {
      await transaction.role.create({
        data: {
          name: roleKey,
        },
      });
    }
  }
  async login(user: any, data: LoginUserData) {
    try {
      const newToken = await this.jwtService.signAsync({
        id: user.id,
        username: data.username,
      });

      const session = await prisma.userSession.findFirst({
        where: { userId: user.id },
      });

      if (session) {
        if (session.isRevoked) {
          throw new BadRequestException('Session Revoked: Contact Admin');
        }

        let sessionExpiration = session.expiresAt;

        if (sessionExpiration < new Date()) {
          const newExpiration = new Date(Date.now() + ONEWEEK);
          newExpiration.setHours(0, 0, 0, 0);
          sessionExpiration = newExpiration;
        }

        await prisma.userSession.update({
          where: { id: session.id },
          data: {
            refreshTokenHash: newToken,
            expiresAt: sessionExpiration,
          },
        });
      } else {
        const expiration = new Date(Date.now() + ONEWEEK);
        expiration.setHours(0, 0, 0, 0);
        await prisma.userSession.create({
          data: {
            userId: user.id,
            refreshTokenHash: newToken,
            expiresAt: expiration,
          },
        });
      }

      return { token: newToken };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async register(data: RegisterUserData) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const isFirstUser = (await transaction.user.count()) === 0;
        const user = await transaction.user.create({});

        const credential = {
          username: data.username,
          password: await createHashedPassword(data.password),
          userId: user.id,
        };
        const userDetails = {
          fname: data.fname,
          lname: data.lname,
          userId: user.id,
        };

        await transaction.userCredential.create({
          data: credential,
        });

        await transaction.userDetails.create({
          data: userDetails,
        });

        if (isFirstUser) {
          await this.configureApp(transaction);
          await transaction.userRole.create({
            data: {
              userId: user.id,
              roleId: Role.SUPERADMIN,
            },
          });
        }
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async authenticate(user: any, token: string) {
    try {
      if (!token) throw new BadRequestException('No token provided');
      await this.jwtService.verifyAsync(token);
      const session = await prisma.userSession.findUnique({
        where: { refreshTokenHash: token, userId: user.id },
      });

      if (!session) throw new BadRequestException('Invalid token');
      if (session.isRevoked)
        throw new BadRequestException('Session Revoked: Contact Admin');

      const currentDate = new Date(Date.now());
      currentDate.setHours(0, 0, 0, 0);

      if (session.expiresAt < currentDate)
        throw new BadRequestException('Session Expired: Please Re Login');

      return { user: user, token: token };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Token has expired');

      throw new BadRequestException(error.message);
    }
  }
}
