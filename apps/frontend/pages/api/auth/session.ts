import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SESSION_COOKIE = 'betx_session';
const SESSION_DURATION = 60 * 60; // 1 hour

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Session API called');

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    console.log('Cookies received:', Object.keys(cookies));

    const token = cookies[SESSION_COOKIE];
    console.log('Session token found:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('No session token, returning valid: false');
      return res.status(200).json({ valid: false });
    }

    console.log('Verifying JWT token...');
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('JWT token verified successfully');

    // Strip exp/iat before re-signing
    const { exp, iat, ...rest } = payload as any;

    // Re-sign for sliding session
    const newToken = jwt.sign(rest, JWT_SECRET, { expiresIn: SESSION_DURATION });

    res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_DURATION,
    }));

    console.log('Session valid, returning valid: true');
    return res.status(200).json({ valid: true, user: payload });
  } catch (e) {
    console.error('Session validation error:', e);
    return res.status(200).json({ valid: false });
  }
}
