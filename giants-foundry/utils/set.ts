export function difference<T>(setA: Set<T>, setB: Set<T>) {
  let _difference = new Set(setA);
  for (let elem of Array.from(setB)) {
    _difference.delete(elem);
  }
  return _difference;
}
