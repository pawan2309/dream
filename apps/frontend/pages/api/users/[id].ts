import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({ where: { id: id as string } });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch user', error: (error as Error).message });
    }
  }
  if (req.method === 'PUT') {
    try {
      const { name, contactno, share, matchcommission, sessioncommission, casinocommission, commissionType, casinoStatus, matchCommission, sessionCommission, password } = req.body;
      // Prepare data object
      const dataToUpdate: any = {
        name,
        contactno,
        share: parseFloat(share) || 0,
        matchcommission: parseFloat(matchcommission) || 0,
        sessioncommission: parseFloat(sessioncommission) || 0,
        casinocommission: parseFloat(casinocommission) || 0,
        commissionType: commissionType || null,
        casinoStatus: typeof casinoStatus === 'boolean' ? casinoStatus : (casinoStatus === 'true'),
        matchCommission: matchCommission !== undefined ? parseFloat(matchCommission) : null,
        sessionCommission: sessionCommission !== undefined ? parseFloat(sessionCommission) : null
      };
      // If password is provided and not empty, hash and update
      if (password && password.length >= 6) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }
      const user = await prisma.user.update({
        where: { id: id as string },
        data: dataToUpdate,
      });
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update user', error: (error as Error).message });
    }
  }
  return res.status(405).json({ success: false, message: 'Method not allowed' });
} 