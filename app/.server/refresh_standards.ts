import { db } from "~/lib/db.server";
import { getStandardsArray } from "~/lib/getStandardsArray.server";
import { standardTitles } from "~/lib/standardTitles";

const modesWithStandards = ["zzmt", "sc", "nonzzmt"];

async function refresh_standards() {
  for (const mode of modesWithStandards) {
    const modeNumber = mode === "nonzzmt" ? 0 : mode === "zzmt" ? 1 : 2;
    const vids = await db.mkscvids.findMany({
      where: { mode: modeNumber },
    });

    await Promise.all(
      vids.map(async (vid) => {
        const standards = await getStandardsArray({
          cid: vid.cid,
          mode: mode,
        });
        const metStandardIndex = standards.findIndex(
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
