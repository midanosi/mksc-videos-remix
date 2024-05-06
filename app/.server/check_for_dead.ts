import { chunk_array } from "~/lib/chunk_array";
import { db } from "~/lib/db.server";

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}
const ytAPIKey = process.env.YT_API_KEY;

async function check_for_dead() {
  const allVids = await db.mkscvids.findMany();

  const linksArrayNotNull = allVids
    .map((vid) => vid.link)
    .filter(notNull)
    .filter((link) => link.length > 0);
  const ytLinksInChunksOf50 = chunk_array(linksArrayNotNull, 50);

  let recordsUpdated = 0;
  const dictOfAliveLinks: Record<string, boolean> = {};

  await Promise.all(
    ytLinksInChunksOf50.map(async (chunk) => {
      const arrayOfLinks = chunk.map((link) => link.slice(0, 11)); // always exactly 11 chars, remove \t=12s etc.
      const concattedLinks = arrayOfLinks.join(",");
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${concattedLinks}&key=${ytAPIKey}&part=snippet&fields=items(snippet,id)`
      );
      const json = await res.json();

      if (json.items) {
        for (const item of json.items) {
          const videoId = item.id;
          const snippet = item.snippet;
          if (snippet) {
            dictOfAliveLinks[videoId] = true;
          }
        }
      }
      return;
    })
  );
  await Promise.all(
    allVids.map(async (vid) => {
      if (vid.link) {
        const shortLink = vid.link?.slice(0, 11);
        const is_alive = dictOfAliveLinks[shortLink] ?? false;
        await db.mkscvids.update({
          where: { id: vid.id },
          data: { is_alive },
        });
        recordsUpdated += 1;
      }
    })
  );

  return {
    totalRecords: allVids.length,
    recordsUpdated,
  };
}

export { check_for_dead };
