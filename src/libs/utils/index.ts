import * as bcrypt from 'bcrypt';
import { prisma } from '../db';
export const createHashedPassword = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
export const validatePassword = async (
  password: string,
  storedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, storedPassword);
};
export const getUserInfo = async (userId: number) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userDetails: true,
      userCredential: true,
      userRole: {
        include: { role: true },
      },
    },
  });

  return userInfo;
};
