function chunk_array<ItemType>(
  input_array: Array<ItemType>,
  chunk: number
): Array<Array<ItemType>> {
  if (input_array.length <= chunk) return [input_array];

  let chunked_array: Array<Array<ItemType>> = [];
  input_array.forEach((_, index) => {
    if (index % chunk === 0)
      chunked_array.push(input_array.slice(index, index + chunk));
  });
  const array_of_left_overs = chunked_array.filter((a) => a.length < chunk);
  const left_overs =
    array_of_left_overs.length > 0 ? array_of_left_overs[0] : [];

  chunked_array = chunked_array.filter((a) => a.length >= chunk);
  chunked_array[chunked_array.length] = [...left_overs];
  return chunked_array;
}
export { chunk_array };
