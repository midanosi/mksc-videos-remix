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
export { chunkArray };
