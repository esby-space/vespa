import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;
export const run = (fn: () => Promise<void>) => fn().finally(() => prisma.$disconnect());

