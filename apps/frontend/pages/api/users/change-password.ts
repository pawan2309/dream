import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SESSION_COOKIE = 'betx_session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get user from session
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies[SESSION_COOKIE];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userId = payload.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    let isCurrentPasswordValid = false;
    if (user.password.startsWith('$2b$')) {
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    } else {
      isCurrentPasswordValid = currentPassword === user.password;
    }

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return res.status(200).json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 