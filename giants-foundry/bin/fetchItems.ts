import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";

async function fetchResult(id: number) {
  try {
    return grandexchange.getItem(id);
  } catch (e) {
    return undefined;
  }
}

const LIMIT = 1000;
async function main() {
  const result: Record<number, Item> = {};
  for (let i = 0; i < LIMIT; i++) {
    const res = await fetchResult(i);
    if (res) {
      result[i] = res;
    }
  }
}

(async () => {
  main();
})();
