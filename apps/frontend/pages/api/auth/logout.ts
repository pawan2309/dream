import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const SESSION_COOKIE = 'betx_session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
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
} 