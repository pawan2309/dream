const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleSessions() {
  try {
    console.log('Fetching users...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true }
    });

    console.log(`Found ${users.length} users:`, users.map(u => `${u.username} (${u.role})`));

    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }

    const sampleSessions = [];

    // Create sample login sessions for each user
    for (const user of users) {
      console.log(`Creating sessions for user: ${user.username}`);
      
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
        console.log(`Created session ${i + 1}/${sessionCount} for ${user.username}`);
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
      console.log(`Created active session for ${user.username}`);
    }

    console.log(`\n✅ Successfully created ${sampleSessions.length} sample login sessions`);
    console.log(`📊 Sessions per user: ${Math.ceil(sampleSessions.length / users.length)}`);
    
    // Show summary by role
    const roleSummary = {};
    for (const user of users) {
      if (!roleSummary[user.role]) {
        roleSummary[user.role] = 0;
      }
      roleSummary[user.role] += Math.ceil(sampleSessions.length / users.length);
    }
    
    console.log('\n📈 Sessions by role:');
    for (const [role, count] of Object.entries(roleSummary)) {
      console.log(`  ${role}: ${count} sessions`);
    }

  } catch (error) {
    console.error('❌ Error creating sample sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSessions(); 