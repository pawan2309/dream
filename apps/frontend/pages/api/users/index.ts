import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

// Function to get role prefix (3 letters)
function getRolePrefix(role: string): string {
  const rolePrefixes: { [key: string]: string } = {
    'ADMIN': 'ADM',
    'SUPER_ADMIN': 'SUD',
    'SUB_OWNER': 'SOW',
    'SUB': 'SUB', 
    'MASTER': 'MAS',
    'SUPER_AGENT': 'SUP',
    'AGENT': 'AGE',
    'USER': 'USE'
  };
  return rolePrefixes[role] || 'USR';
}

// Function to generate username based on role (3 letters + 4 digits)
function generateUsername(role: string, existingUsers: string[] = []) {
  const prefix = getRolePrefix(role);
  let counter = 1;
  let username = `${prefix}${counter.toString().padStart(4, '0')}`;
  while (existingUsers.includes(username)) {
    counter++;
    username = `${prefix}${counter.toString().padStart(4, '0')}`;
  }
  return username;
}

// Function to generate unique code (same as username)
function generateCode(role: string, existingCodes: string[] = []) {
  return generateUsername(role, existingCodes);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List users with optional role and parentId filtering
    try {
      const { role, parentId } = req.query;
      let whereClause: any = {};
      if (role && typeof role === 'string') {
        whereClause.role = role as any;
      }
      if (parentId && typeof parentId === 'string') {
        whereClause.parentId = parentId;
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
          contactno: true,
          share: true, // Ensure share is included
          matchCommission: true,
          sessionCommission: true,
          parentId: true, // <-- Add this line
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
        parentId,
        commissionType,
        casinoStatus,
        matchCommission,
        sessionCommission
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

      // Get the id of the currently logged-in user from the session
      const session = req.cookies['betx_session'];
      let creatorId = null;
      if (session) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(session, process.env.JWT_SECRET || 'dev_secret');
          creatorId = decoded.user?.id || null;
        } catch (e) {
          creatorId = null;
        }
      }

      // Ensure parentId is a valid UUID, not a role name
      let resolvedParentId = null;
      if (typeof parentId !== 'undefined' && parentId !== null) {
        // If parentId looks like a UUID, use it directly
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (uuidRegex.test(parentId)) {
          resolvedParentId = parentId;
        } else {
          // If parentId is a role name, look up the first user with that role
          const parentUser = await prisma.user.findFirst({ where: { role: parentId } });
          if (parentUser) {
            resolvedParentId = parentUser.id;
          } else {
            return res.status(400).json({ success: false, message: `No user found with role ${parentId} to use as parent.` });
          }
        }
      } else {
        // Determine if the new user is a top-level role
        const topLevelRoles = ['SUB_OWNER']; // Add other top-level roles if needed
        const isTopLevel = topLevelRoles.includes(role);
        resolvedParentId = isTopLevel ? null : creatorId;
      }

      // Create user with all fields
      const userData = {
        username,
        name,
        password: hashedPassword,
        role: role as any, // Cast to Role enum
        parentId: resolvedParentId,
        creditLimit: req.body.creditLimit !== undefined ? Number(req.body.creditLimit) : 0,
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
        casinocommission: parseFloat(casinocommission) || 0,
        commissionType: commissionType || null,
        casinoStatus: typeof casinoStatus === 'boolean' ? casinoStatus : (casinoStatus === 'true'),
        matchCommission: matchCommission !== undefined ? parseFloat(matchCommission) : null,
        sessionCommission: sessionCommission !== undefined ? parseFloat(sessionCommission) : null
      };

      console.log('Creating user with data:', userData);

      const user = await prisma.user.create({
        data: userData
      });

      // Create a ledger entry for initial creditLimit if > 0
      if (user.creditLimit > 0) {
        // Fetch parent/creator user info if available
        let parentName = 'System';
        if (user.parentId) {
          const parentUser = await prisma.user.findUnique({ where: { id: user.parentId } });
          if (parentUser) {
            parentName = `${parentUser.code || ''} ${parentUser.name || ''}`.trim();
          }
        }
        await prisma.ledger.create({
          data: {
            userId: user.id,
            collection: 'LIMIT_UPDATE',
            debit: 0,
            credit: user.creditLimit,
            balanceAfter: user.creditLimit,
            type: 'ADJUSTMENT',
            remark: `Coins deposit from 0 to ${user.creditLimit} updated From ${parentName}`,
          }
        });
      }

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

export default handler; 