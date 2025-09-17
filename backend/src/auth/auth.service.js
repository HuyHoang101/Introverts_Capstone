import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'greensync-default-secret';

export const registerUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: {
      email: { equals: email.trim(), mode: 'insensitive' },
    },
  });

  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  const { password: _pw, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

