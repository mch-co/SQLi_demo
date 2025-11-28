import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        username: "kodjo_aklesso",
        email: "kodjo.aklesso@example.tg",
        password: "adminpass1",
        role: "admin",
      },
      {
        username: "kossi_anani",
        email: "kossi.anani@example.tg",
        password: "userpass2",
        role: "user",
      },
      {
        username: "mawuena_abla",
        email: "mawuena.abla@example.tg",
        password: "userpass3",
        role: "user",
      },
      {
        username: "komlan_attiogbe",
        email: "komlan.attiogbe@example.tg",
        password: "modpass4",
        role: "moderator",
      },
    ],
  });
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
