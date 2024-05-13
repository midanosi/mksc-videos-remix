import { db } from "~/lib/db.server";
import { standardTitles } from "~/lib/standardTitles";
import { openStandardCSV } from "~/lib/openStandardsCSV";

const modesWithStandards = ["zzmt", "sc", "nonzzmt"];

async function refresh_standards() {
  const standardFiles = {
    nonzzmt: await openStandardCSV("nonzzmt"),
    zzmt: await openStandardCSV("zzmt"),
    sc: await openStandardCSV("sc"),
  };

  for (const mode of modesWithStandards) {
    const modeNumber = mode === "nonzzmt" ? 0 : mode === "zzmt" ? 1 : 2;
    const vids = await db.mkscvids.findMany({
      where: { mode: modeNumber },
    });

    await Promise.all(
      vids.map(async (vid) => {
        const file = standardFiles[mode] ?? undefined;
        if (!file) return console.error("No file found for mode", mode);
        const lines = (file as string).split("\n");
        const standardRow = lines[vid.cid].split(",").slice(1); // slice 1 to ignore the cid at the start
        const metStandardIndex = standardRow.findIndex(
          (standard) => Number(vid.time) < Number(standard)
        );
        if (metStandardIndex !== -1) {
          await db.mkscvids.update({
            where: { id: vid.id },
            data: { standard: standardTitles[metStandardIndex] },
          });
        }
      })
    );
  }

  return;
}

export { refresh_standards };
