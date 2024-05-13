import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { db } from "~/lib/db.server";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return null;
  }
  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId);
  const emailAddress = user.emailAddresses[0]?.emailAddress;
  const discordUserId = user.externalAccounts[0]?.externalId;

  const adminUser = await db.admins.findFirst({
    where: {
      OR: [
        {
          email_address: emailAddress,
        },
        {
          discord_user_id: discordUserId,
        },
      ],
    },
  });
  return { isAdmin: adminUser !== undefined };
};
