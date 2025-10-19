import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Generating invite codes for existing groups...\n');

  const groups = await prisma.group.findMany({
    where: {
      inviteCode: null,
    },
  });

  console.log(`Found ${groups.length} groups without invite codes\n`);

  for (const group of groups) {
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    await prisma.group.update({
      where: { id: group.id },
      data: { inviteCode },
    });

    console.log(`✅ Group "${group.name}" → ${inviteCode}`);
  }

  console.log('\n✨ Done!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
