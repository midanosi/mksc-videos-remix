function formatTime(time: number): string {
  const decimals = (time % 1).toFixed(2).toString().replace("0.", "");

  const minute = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  if (time >= 60) {
    return minute + "'" + seconds + '"' + decimals;
  } else if (time >= 10 && time < 60) {
    return seconds + '"' + decimals;
  }
  return seconds + '"' + decimals;
}
export { formatTime };
