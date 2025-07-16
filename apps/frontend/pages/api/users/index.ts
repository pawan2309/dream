import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

// Function to generate username based on role
function generateUsername(role: string, existingUsers: string[] = []) {
  const prefix = role.substring(0, 2).toUpperCase();
  let counter = 1;
  let username = `${prefix}${counter.toString().padStart(3, '0')}`;
  while (existingUsers.includes(username)) {
    counter++;
    username = `${prefix}${counter.toString().padStart(3, '0')}`;
  }
  return username;
}

// Function to generate unique code
function generateCode(role: string, existingCodes: string[] = []) {
  const prefix = role.substring(0, 2).toUpperCase();
  let counter = 1;
  let code = `${prefix}${counter.toString().padStart(3, '0')}`;
  while (existingCodes.includes(code)) {
    counter++;
    code = `${prefix}${counter.toString().padStart(3, '0')}`;
  }
  return code;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List users with optional role filtering
    try {
      const { role } = req.query;
      
      let whereClause = {};
      if (role && typeof role === 'string') {
        whereClause = { role: role as any };
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          balance: true,
          creditLimit: true,
          isActive: true,
          createdAt: true,
          code: true,
          contactno: true
        } as any,
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch users', error: (error as Error).message });
    }
  }

  if (req.method === 'POST') {
    // Create a new user
    try {
      console.log('Creating user with body:', req.body);
      
      const { 
        role, 
        password, 
        name, 
        contactno, 
        reference,
        share,
        cshare,
        icshare,
        mobileshare,
        session_commission_type,
        matchcommission,
        sessioncommission,
        casinocommission,
        parentId
      } = req.body;

      console.log('Extracted fields:', { role, name, contactno, parentId });

      if (!role || !password || !name) {
        console.log('Missing required fields:', { role: !!role, password: !!password, name: !!name });
        return res.status(400).json({ success: false, message: 'Role, password, and name are required' });
      }

      // Get existing usernames and codes
      const existingUsers = await prisma.user.findMany({ 
        select: { username: true, code: true } 
      });
      const existingUsernames = existingUsers.map((u: { username: string }) => u.username);
      const existingCodes = existingUsers.map((u: { code: string | null }) => u.code).filter((code): code is string => code !== null);

      // Generate unique code (and use as username)
      const code = generateCode(role, existingCodes);
      const username = code; // Username is now the same as code

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Generated username:', username);
      console.log('Generated code:', code);
      console.log('Hashed password length:', hashedPassword.length);

      // Create user with all fields
      const userData = {
        username,
        name,
        password: hashedPassword,
        role: role as any, // Cast to Role enum
        parentId: parentId || null,
        balance: 0,
        isActive: true,
        code,
        reference: reference || null,
        contactno: contactno || null,
        share: parseFloat(share) || 0,
        cshare: parseFloat(cshare) || 0,
        icshare: parseFloat(icshare) || 0,
        mobileshare: parseFloat(mobileshare) || 100,
        session_commission_type: session_commission_type || "No Comm",
        matchcommission: parseFloat(matchcommission) || 0,
        sessioncommission: parseFloat(sessioncommission) || 0,
        casinocommission: parseFloat(casinocommission) || 0
      };

      console.log('Creating user with data:', userData);

      const user = await prisma.user.create({
        data: userData
      });

      console.log('User created successfully:', user.id);

      return res.status(201).json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          name: user.name,
          role: user.role, 
          isActive: user.isActive,
          code: user.code
        } 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ success: false, message: 'Failed to create user', error: (error as Error).message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
} 