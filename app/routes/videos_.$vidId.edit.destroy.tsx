import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { db } from "~/lib/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.vidId, "Missing vidId param");

  const mkscvid = await db.mkscvids.findFirst({
    where: { id: Number(params.vidId) },
  });
  if (!mkscvid) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ mkscvid });
};

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.vidId, "Missing vidId param");

  await db.mkscvids.delete({
    where: { id: Number(params.vidId) },
  });

  return redirect(`/`);
};
