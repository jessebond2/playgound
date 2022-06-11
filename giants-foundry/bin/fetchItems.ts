import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";
import { createWriteStream, createReadStream } from "fs";
import { join } from "path";
import asyncBatch from "async-batch";
import { AxiosError } from "axios";

type ItemRecord = Record<number, Item>;

const LIMIT = 30000;
const CONCURRENCY_LIMIT = 1;

async function fetchResult(id: number) {
  try {
    const result = await grandexchange.getItem(id);
    return result;
  } catch (e) {
    let error = e as AxiosError;
    console.log(`Unable to find ${id}: ${error.code} ${error.message}`, error);

    return undefined;
  }
}

async function loadFile(path: string) {
  const readable = createReadStream(path, { encoding: "utf8" });
  let file = "";
  for await (const chunk of readable) {
    file += chunk;
  }
  return file;
}

async function loadRawItemIds() {
  const path = join(__dirname, "..", "data", "raw item ids.txt");
  const file = await loadFile(path);
  const lines = file.split("\n").map((l) => l.trim());
  const ids = [];

  for (let line of lines) {
    const parts = line.split(" ");

    if (parts[2] !== "null") {
      console.log(parts);
      ids.push(parseInt(parts[0]));
    }
  }

  return ids;
}

async function loadCompletedItems() {
  const path = join(__dirname, "..", "data", "itemIds.json");

  const file = await loadFile(path);
  const completed: ItemRecord = JSON.parse(file);

  return completed;
}

function difference<T>(setA: Set<T>, setB: Set<T>) {
  let _difference = new Set(setA);
  for (let elem of Array.from(setB)) {
    _difference.delete(elem);
  }
  return _difference;
}

function getRemainingItemIds(completedItems: ItemRecord, rawItemIds: number[]) {
  const completedSet = new Set(
    Object.keys(completedItems).map((x) => parseInt(x))
  );
  const rawSet = new Set(rawItemIds);

  return Array.from(difference(rawSet, completedSet));
}

async function writeData(data: ItemRecord) {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "itemIds.json")
  );
  writeStream.write(JSON.stringify(data));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

function sortItems(items: ItemRecord) {
  return Object.keys(items)
    .sort()
    .reduce((obj, key) => {
      obj[parseInt(key)] = items[parseInt(key)];
      return obj;
    }, {} as ItemRecord);
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const items: ItemRecord = (await loadCompletedItems()) || {};
  const rawIds = await loadRawItemIds();
  const remainingIds = getRemainingItemIds(items, rawIds);

  console.log(
    `${remainingIds.length} remaining ids of the original ${rawIds.length} ids`
  );

  let progress = 0;
  await asyncBatch(
    remainingIds,
    async (task) => {
      const res = await fetchResult(task);
      progress++;
      const completion = ((progress / LIMIT) * 100).toFixed(2);
      if (res) {
        items[task] = res;
        console.log(`itemId ${task} found. ${completion}% done`);
      } else {
        console.log(`itemId ${task} not found. ${completion}% done`);
      }

      if (progress > 0 && progress % 100 === 0) {
        writeData(sortItems(items));
      }

      await sleep(5000);
    },
    CONCURRENCY_LIMIT
  );

  console.log(
    `Finished looking up items. Found ${Object.keys(items).length} items`
  );

  writeData(sortItems(items));
}

(async () => {
  await main();
})();
