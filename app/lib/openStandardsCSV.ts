import path from "path";
import fs, { promises } from "fs";

export class FileUtils {
  /**
   * Retrieves the public file path for a given original path.
   * We need to do this for Vercel, otherwise it won't find the file.
   *
   * @param {string} originalPath - The original path of the file.
   * @return {string} The resolved public file path.
   */
  public static getPublicFilePath(originalPath: string): string {
    originalPath = originalPath.replace("./public/", "");
    return path.resolve("./public", originalPath);
  }
}

async function openStandardCSV(mode: string) {
  const publicDirectory = path.join(process.cwd(), "public");
  const filename =
    mode === "nonzzmt"
      ? "standards_nonzzmt.csv"
      : mode === "zzmt"
      ? "standards_zzmt.csv"
      : "standards_sc.csv";
  const standardsFile = path.join(publicDirectory, filename);

  const csv = await promises.readFile(
    FileUtils.getPublicFilePath(standardsFile),
    "utf8"
  );
  return csv;
}
function openStandardCSVSync(mode: string) {
  const publicDirectory = path.join(process.cwd(), "public");
  const filename =
    mode === "nonzzmt"
      ? "standards_nonzzmt.csv"
      : mode === "zzmt"
      ? "standards_zzmt.csv"
      : "standards_sc.csv";
  const standardsFile = path.join(publicDirectory, filename);

  const csv = fs.readFileSync(
    FileUtils.getPublicFilePath(standardsFile),
    "utf8"
  );
  return csv;
}
export { openStandardCSV, openStandardCSVSync };
