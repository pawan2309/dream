import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SESSION_COOKIE = 'betx_session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Verify session
    const cookies = parse(req.headers.cookie || '');
    const token = cookies[SESSION_COOKIE];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.user?.id;
    if (!decoded || !userId) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    const { userIds, isActive, role } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'User IDs are required' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    // Update all specified users
    const updateResult = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        role: role || undefined, // Optional role filter
      },
      data: {
        isActive: isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully ${isActive ? 'activated' : 'deactivated'} ${updateResult.count} users`,
      updatedCount: updateResult.count,
    });

  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
} 