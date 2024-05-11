import path from "path";
import { promises as fs } from "fs";

async function getStandardsArray({ cid, mode }: { cid: number; mode: string }) {
  if (mode === "nolapskips") return [];
  const publicDirectory = path.join(process.cwd(), "public");
  const filename =
    mode === "nonzzmt"
      ? "standards_nonzzmt.csv"
      : mode === "zzmt"
      ? "standards_zzmt.csv"
      : "standards_sc.csv";
  const standardsFile = path.join(publicDirectory, filename);

  const nonscCSV = await fs.readFile(standardsFile, "utf8");
  const lines = nonscCSV.split("\n");
  const standards = lines[cid].split(",").slice(1); // slice 1 to ignore the cid at the start
  return standards;
}
export { getStandardsArray };
