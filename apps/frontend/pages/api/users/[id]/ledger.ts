import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const ledger = await prisma.ledger.findMany({
      where: {
        userId: id,
        collection: 'LIMIT_UPDATE',
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, ledger });
  } catch (error) {
    console.error('Error fetching ledger:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 