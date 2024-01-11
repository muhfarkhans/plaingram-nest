// run "npx prisma db seed" to running the seeder
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon.hash('password');
  const user = await prisma.user.upsert({
    where: { email: 'koko@koko.koko' },
    update: {},
    create: {
      name: 'koko',
      email: 'koko@koko.koko',
      password: passwordHash,
      about: '',
    },
  });

  const fakerPost = () => ({
    userId: user.id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    tag: faker.lorem.word(),
    thumbnail: '',
    is_shared: 0,
    postId: '',
  });

  const posts = Array.from({ length: 400 }, fakerPost);
  await prisma.post.createMany({ data: posts });

  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
