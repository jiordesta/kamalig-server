import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { prisma } from 'src/libs/db';
import { JWTPayload } from 'src/libs/types';
import { getUserInfo } from 'src/libs/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: JWTPayload) {
    const { id } = payload;

    if (!id) throw new BadRequestException('Invalid token payload');

    const user = await getUserInfo(id);

    if (!user) throw new BadRequestException('User not found');

    return user;
  }
}
