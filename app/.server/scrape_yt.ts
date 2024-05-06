import { chunk_array } from "~/lib/chunk_array";
import { db } from "~/lib/db.server";

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}
const ytAPIKey = process.env.YT_API_KEY;
console.log(`ytAPIKey`, ytAPIKey);

async function scrape_yt() {
  const vidsMissingData = await db.mkscvids.findMany({
    where: { uploaded_at: null },
  });
  const ytNameItems = await db.mkscytnames.findMany();
  const channelIdToPlayerNameMap = Object.fromEntries(
    ytNameItems.map((item) => [item.id, item.name])
  );

  const linksArrayNotNull = vidsMissingData
    .map((vid) => vid.link)
    .filter(notNull)
    .filter((link) => link.length > 0);
  const ytLinksInChunksOf50 = chunk_array(linksArrayNotNull, 50);

  let recordsUpdated = 0;
  for (const chunk of ytLinksInChunksOf50) {
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
          const channelId = snippet.channelId;
          const date = snippet.publishedAt;

          const playerName = channelIdToPlayerNameMap[channelId];

          const matchingVid = vidsMissingData.find((vid) => {
            const shortLink = vid.link?.slice(0, 11);
            return shortLink === videoId;
          });
          if (matchingVid) {
            await db.mkscvids.update({
              where: { id: matchingVid.id },
              data: {
                uploaded_at: date,
                player: playerName,
                is_alive: true,
              },
            });
            recordsUpdated += 1;
            console.log(`recordsUpdated`, recordsUpdated);
          }
        }
      }
    }
  }
  return {
    recordsMissingData: vidsMissingData.length,
    recordsUpdated,
  };

  // const standards = await getStandardsArray({
  //   cid: params.cid,
  //   mode: params.mode,
  // });

  // mkscvids.forEach((mkscvid) => {
  //   const metStandardIndex = standards.findIndex(
  //     (standard) => mkscvid.time < standard
  //   );
  //   if (metStandardIndex !== -1) {
  //     mkscvid.standard = standardTitles[metStandardIndex];
  //   }
  // });
}

export { scrape_yt };
