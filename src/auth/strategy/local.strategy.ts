import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { prisma } from 'src/libs/db';
import { getUserInfo, validatePassword } from 'src/libs/utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }
  async validate(username: string, password: string) {
    const userCredential = await prisma.userCredential.findUnique({
      where: { username },
    });
    if (!userCredential)
      throw new BadRequestException('Username Not Associated to any Account');
    if (!(await validatePassword(password, userCredential.password)))
      throw new BadRequestException('Password Not Matched');
    if (!userCredential.userId) throw new BadRequestException('User Not Found');
    const user = await getUserInfo(userCredential.userId);
    if (!user) throw new BadRequestException('User Not Found');
    return user;
  }
}
