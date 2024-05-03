import { json } from "@remix-run/node";
import { db } from "~/lib/db.server";

type Video = {
  cid: number;
  time: number;
  link: string;
  mode: number;
  player: string;
  // standard: string
  // date: string
};

async function createNewVideo(video: Video) {
  return await db.mkscvids.create({
    data: {
      ...video,
    },
  });
}

export const action = async (video: Video) => {
  const contact = await createNewVideo(video);
  return json({ contact });
};

export default function AddVideo() {
  return <span>add video</span>;
}
