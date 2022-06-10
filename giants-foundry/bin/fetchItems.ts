import { Item } from "runescape-api/lib/RuneScape";
import { grandexchange } from "runescape-api/osrs";
import { createWriteStream } from "fs";
import { join } from "path";
import asyncBatch from "async-batch";

async function fetchResult(id: number) {
  try {
    const result = await grandexchange.getItem(id);
    return result;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

const LIMIT = 1000;
const CONCURRENCY_LIMIT = 10;
const IDS = [Array.from(Array(LIMIT).keys())];

async function main() {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "itemIds.json")
  );

  const result: Record<number, Item> = {};
  // for (let i = 0; i < LIMIT; i++) {
  //   const progress = ((0 / LIMIT) * 100).toFixed(2);
  //   const res = await fetchResult(i);
  //   if (res) {
  //     result[i] = res;
  //     console.log(`itemId ${i} found. ${progress}% done`);
  //   } else {
  //     console.log(`itemId ${i} not found. ${progress}% done`);
  //   }
  // }
  let progress = 0;
  const asyncResult = await asyncBatch(
    IDS,
    async (task, taskIndex) => {
      const res = await fetchResult(taskIndex);
      progress++;
      if (res) {
        result[taskIndex] = res;
        console.log(`itemId ${taskIndex} found. ${progress}% done`);
      } else {
        console.log(`itemId ${taskIndex} not found. ${progress}% done`);
      }
    },
    CONCURRENCY_LIMIT
  );

  console.log("Writing result");
  writeStream.write(JSON.stringify(result));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

(async () => {
  await main();
})();
