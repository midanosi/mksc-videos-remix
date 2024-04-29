import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
export { db };

// import { PrismaClient } from "@prisma/client";

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global) {
//     throw new Error("global is undefined");
//   }
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;
