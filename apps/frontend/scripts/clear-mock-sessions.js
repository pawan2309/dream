const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearMockSessions() {
  try {
    console.log('Clearing all mock login sessions...');
    
    // Delete all login sessions
    const result = await prisma.loginSession.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} mock login sessions`);
    console.log('📊 Database is now clean and ready for real user sessions');
    
  } catch (error) {
    console.error('❌ Error clearing mock sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMockSessions(); 