import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true }
    });

    if (users.length === 0) {
      return res.status(400).json({ error: 'No users found in database' });
    }

    const sampleSessions = [];

    // Create sample login sessions for each user
    for (const user of users) {
      // Create 2-5 sessions per user
      const sessionCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < sessionCount; i++) {
        const loginAt = new Date();
        loginAt.setHours(loginAt.getHours() - Math.floor(Math.random() * 24 * 7)); // Random time in last week
        
        const sessionDuration = Math.floor(Math.random() * 180) + 10; // 10-190 minutes
        const logoutAt = new Date(loginAt.getTime() + sessionDuration * 60 * 1000);
        
        const deviceTypes = ['desktop', 'mobile', 'tablet'];
        const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
        
        const session = await prisma.loginSession.create({
          data: {
            userId: user.id,
            loginAt,
            logoutAt,
            sessionDuration,
            deviceType,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            isActive: false,
          },
        });
        
        sampleSessions.push(session);
      }
      
      // Create one active session for each user
      const activeSession = await prisma.loginSession.create({
        data: {
          userId: user.id,
          loginAt: new Date(),
          deviceType: 'desktop',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          isActive: true,
        },
      });
      
      sampleSessions.push(activeSession);
    }

    res.status(200).json({
      success: true,
      message: `Created ${sampleSessions.length} sample login sessions`,
      sessions: sampleSessions.length,
      users: users.length,
    });
  } catch (error) {
    console.error('Error creating sample sessions:', error);
    res.status(500).json({ error: 'Failed to create sample sessions' });
  }
} 