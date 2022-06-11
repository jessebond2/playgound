import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";
import { createWriteStream, createReadStream } from "fs";
import { join } from "path";
import asyncBatch from "async-batch";
import { AxiosError } from "axios";

type ItemRecord = Record<number, Item>;

const LIMIT = 30000;
const CONCURRENCY_LIMIT = 1;
const THROTTLE_WAIT = 1000;
const badIds: number[] = [];

async function fetchResult(id: number) {
  let tries = 0;
  do {
    try {
      const result = await grandexchange.getItem(id);
      return result;
    } catch (e) {
      let error = e as AxiosError;
      console.log(`Unable to find ${id}: ${error.message}`);
      if (
        error.message.indexOf("HTTPError: Response code 404 (Not Found)") >= 0
      ) {
        badIds.push(id);
      } else {
        await sleep(30000);
      }
      tries++;
    }
  } while (tries < 5);
  return undefined;
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

async function loadBadItems() {
  const path = join(__dirname, "..", "data", "badItemIds.txt");

  const file = await loadFile(path);
  const completed: number[] = file.split(",").map((x) => parseInt(x));

  return completed;
}

function difference<T>(setA: Set<T>, setB: Set<T>) {
  let _difference = new Set(setA);
  for (let elem of Array.from(setB)) {
    _difference.delete(elem);
  }
  return _difference;
}

function getRemainingItemIds(
  completedItems: ItemRecord,
  rawItemIds: number[],
  badItemIds: number[]
) {
  const completedSet = new Set(
    Object.keys(completedItems).map((x) => parseInt(x))
  );
  const rawSet = new Set(rawItemIds);
  const badSet = new Set(badItemIds);

  const partial = difference(rawSet, completedSet);
  return Array.from(difference(partial, badSet));
}

async function writeItemData(data: ItemRecord) {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "itemIds.json")
  );
  writeStream.write(JSON.stringify(data));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

async function writeBadItemData(data: number[]) {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "badItemIds.txt")
  );
  writeStream.write(data.join(","));
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
  const badItemIds = await loadBadItems();
  const remainingIds = getRemainingItemIds(items, rawIds, badItemIds);

  console.log(
    `${remainingIds.length} remaining ids of the original ${rawIds.length} ids`
  );

  let progress = 0;
  await asyncBatch(
    remainingIds,
    async (task) => {
      const res = await fetchResult(task);
      progress++;
      const completion = ((progress / remainingIds.length) * 100).toFixed(2);
      if (res) {
        items[task] = res;
        console.log(`itemId ${task} found. ${completion}% done`);
      } else {
        console.log(`itemId ${task} not found. ${completion}% done`);
      }

      if (progress > 0 && progress % 20 === 0) {
        writeItemData(sortItems(items));
        writeBadItemData(badIds);
      }

      await sleep(THROTTLE_WAIT);
    },
    CONCURRENCY_LIMIT
  );

  console.log(
    `Finished looking up items. Found ${Object.keys(items).length} items`
  );

  writeItemData(sortItems(items));
  writeBadItemData(badIds);
}

(async () => {
  await main();
})();
