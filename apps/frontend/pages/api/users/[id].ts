import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        contactno: true,
        role: true,
        isActive: true,
        balance: true,
        creditLimit: true,
        share: true,
        createdAt: true,
        updatedAt: true
      } as any
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ 
      success: true,
      user 
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
} 