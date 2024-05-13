import { LoaderFunction, json } from "@remix-run/node";
import { db } from "~/lib/db.server";

const ytAPIKey = process.env.YT_API_KEY;

export const loader: LoaderFunction = async ({ request }) => {
  console.log(`request`, request);
  const url = new URL(request.url);
  const yturl = url.searchParams.get("yturl");
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${yturl}&key=${ytAPIKey}&part=snippet&fields=items(snippet,id)`
  );
  const videos = await res.json();
  const video = videos.items[0];

  const channelId = video.snippet.channelId;
  const playerNameRow = await db.mkscytnames.findFirst({
    where: { id: channelId },
    select: { name: true },
  });
  const playerName = playerNameRow?.name;

  return json({ youtubeMetadata: video, playerName });
};
