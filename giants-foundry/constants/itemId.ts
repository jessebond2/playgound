import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";

const LIMIT = 1000;

async function fetchItem(id: number) {
  try {
    return grandexchange.getItem(id);
  } catch (e) {
    return undefined;
  }
}

async function main() {
  const results: Record<number, Item> = {};
  for (let i = 0; i < LIMIT; i++) {
    const res = await fetchItem(i);
    if (res) {
      results[i] = res;
    }
  }
}

(async () => {
  main();
})();
