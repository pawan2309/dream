import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SESSION_COOKIE = 'betx_session';
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

// Helper function to detect device type
function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
  
  if (tabletRegex.test(userAgent)) {
    return 'tablet';
  } else if (mobileRegex.test(userAgent)) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Login API called with method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  console.log('Login attempt for username:', username);

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    console.log('Attempting to find user in database...');
    const user = await prisma.user.findUnique({ where: { username } });
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User data:', { id: user?.id, username: user?.username, name: user?.name, role: user?.role });

    if (!user) {
      console.log('User not found, returning Contact admin');
      return res.status(404).json({ success: false, message: 'Contact admin' });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User is inactive, returning Contact admin');
      return res.status(403).json({ success: false, message: 'Contact admin' });
    }

    console.log('Checking password...');
    let isMatch = false;
    
    // Check if password is bcrypt hashed (starts with $2b$)
    if (user.password.startsWith('$2b$')) {
      console.log('Using bcrypt comparison');
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      console.log('Using plain text comparison');
      isMatch = password === user.password;
    }
    
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, message: 'Password wrong' });
    }

    console.log('Password correct, creating JWT token...');
    const token = jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        }
      },
      JWT_SECRET,
      { expiresIn: SESSION_DURATION }
    );

    // Create login session
    try {
      console.log('Creating login session...');
      
      // Close any existing active sessions for this user
      await prisma.loginSession.updateMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        data: {
          isActive: false,
          logoutAt: new Date(),
        },
      });

      // Create new login session
      const loginSession = await prisma.loginSession.create({
        data: {
          userId: user.id,
          ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          deviceType: getDeviceType(req.headers['user-agent'] as string),
          isActive: true,
        },
      });

      console.log('Login session created:', loginSession.id);
    } catch (sessionError) {
      console.error('Error creating login session:', sessionError);
      // Don't fail the login if session creation fails
    }

    console.log('JWT token created, setting cookie...');
    res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_DURATION,
    }));

    console.log('Login successful, returning success response');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
}
