import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";
import { createWriteStream, createReadStream } from "fs";
import { join } from "path";
import asyncBatch from "async-batch";

async function fetchResult(id: number) {
  try {
    const result = await grandexchange.getItem(id);
    return result;
  } catch (e) {
    // console.log("fetchResults", e);
    return undefined;
  }
}

const LIMIT = 30000;
const CONCURRENCY_LIMIT = 10;
const IDS = Array.from(Array(LIMIT).keys());

async function loadItemIds() {
  const path = join(__dirname, "..", "data", "raw item ids.txt");
  const readable = createReadStream(path, { encoding: "utf8" });

  const ids = [];
  for await (const line of readable) {
    const parts = line.split(" ");
    if (parts[2] !== "null") {
      ids.push(parseInt(parts[0]));
    }
  }

  console.log(`Loaded ${ids.length} ids`);

  return ids;
}

async function main() {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "itemIds.json")
  );

  const result: Record<number, Item> = {};
  const loadedIds = await loadItemIds();

  let progress = 0;
  const asyncResult = await asyncBatch(
    // IDS,
    loadedIds,
    async (task) => {
      const res = await fetchResult(task);
      progress++;
      const completion = ((progress / LIMIT) * 100).toFixed(2);
      if (res) {
        result[task] = res;
        console.log(`itemId ${task} found. ${completion}% done`);
      } else {
        console.log(`itemId ${task} not found. ${completion}% done`);
      }
    },
    CONCURRENCY_LIMIT
  );

  const sortedItems = Object.keys(result)
    .sort()
    .reduce((obj, key) => {
      obj[parseInt(key)] = result[parseInt(key)];
      return obj;
    }, {} as Record<number, Item>);
  console.log(
    `Finished looking up items. Found ${Object.keys(result).length} items`
  );

  writeStream.write(JSON.stringify(sortedItems));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

(async () => {
  await main();
})();
