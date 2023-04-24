export function removeDuplicates<T>(...args: T[]) {
  return [...new Map(args.map((item) => [JSON.stringify(item), item])).values()]
}
