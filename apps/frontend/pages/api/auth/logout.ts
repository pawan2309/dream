import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE = 'betx_session';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get the current session token from cookies
    const token = req.cookies[SESSION_COOKIE];
    
    if (token) {
      try {
        // Decode the JWT to get user information
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Close the active login session
        await prisma.loginSession.updateMany({
          where: {
            userId: decoded.id,
            isActive: true,
          },
          data: {
            isActive: false,
            logoutAt: new Date(),
            sessionDuration: Math.round(
              (new Date().getTime() - new Date(decoded.iat * 1000).getTime()) / (1000 * 60)
            ),
          },
        });
      } catch (jwtError) {
        console.error('Error processing JWT during logout:', jwtError);
        // Continue with logout even if JWT processing fails
      }
    }

    // Clear the session cookie by setting it to expire immediately
    res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    }));

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 