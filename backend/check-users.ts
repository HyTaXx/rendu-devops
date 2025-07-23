import { prisma } from './src/utils/prisma';

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        createdAt: true
      }
    });
    
    if (users.length === 0) {
      console.log('No users found in database. You need to register a user first.');
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
