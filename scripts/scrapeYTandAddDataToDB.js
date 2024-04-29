function chunkArray(a, chunk) {
    if (a.length <= chunk) return [a];
    let arr = [];
    a.forEach((_, i) => {
      if (i % chunk === 0) arr.push(a.slice(i, i + chunk));
    });
    const [left_overs] = arr.filter((a) => a.length < chunk);
    arr = arr.filter((a) => a.length >= chunk);
    arr[arr.length - 1] = [...arr[arr.length - 1], ...left_overs];
    return arr;
  }
const mkscvids = await prisma.mkscvids.findAll({
    where: { cid: Number(params.cid), mode: modeId },
    // select: { cid: true, link: true, time: true },
    orderBy: { time: "asc" },
  });
  const ytNameItems = await prisma.mkscytnames.findMany();
  const channelIdToPlayerNameMap = Object.fromEntries(
    ytNameItems.map((item) => [item.id, item.name])
  );

  const ytLinksInChunksOf50 = chunkArray(
    mkscvids.map((vid) => vid.link),
    50
  );
  for (const chunk of ytLinksInChunksOf50) {
    const arrayOfLinks = chunk.map((link) => link.slice(0, 11)); // always exactly 11 chars, remove \t=12s etc.
    const concattedLinks = arrayOfLinks.join(",");

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${concattedLinks}&key=AIzaSyATN_FTkF9ehCDRJa4IaketQD3jMDlNTw8&part=snippet&fields=items(snippet,id)`
    );
    const json = await res.json();

    json.items?.forEach((item) => {
      const videoId = item.id;
      const snippet = item.snippet;
      if (!snippet) return;

      const channelId = snippet.channelId;
      const date = snippet.publishedAt;

      const playerName = channelIdToPlayerNameMap[channelId];

      const matchingVid = mkscvids.find((vid) => vid.link === videoId);
      if (matchingVid) {
        const dateobj = new Date(date);
        matchingVid.date = dateobj.toLocaleDateString("en-US");

        if (playerName) {
          matchingVid.player = playerName;
        }
      }
    });
  }

  const standards = await getStandardsArray({
    cid: params.cid,
    mode: params.mode,
  });

  mkscvids.forEach((mkscvid) => {
    const metStandardIndex = standards.findIndex(
      (standard) => mkscvid.time < standard
    );
    if (metStandardIndex !== -1) {
      mkscvid.standard = standardTitles[metStandardIndex];
    }
  });