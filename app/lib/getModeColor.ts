export type Mode = "nonzzmt" | "zzmt" | "sc" | "nolapskips";

export function getModeColor(mode: Mode) {
  if (mode === "nonzzmt") return "#8e44ad";
  if (mode === "zzmt") return "#27ae60";
  if (mode === "sc") return "#c0392b";
  if (mode === "nolapskips") return "#d35400";
  return undefined;
}
