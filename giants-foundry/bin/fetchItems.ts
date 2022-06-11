import { grandexchange } from "runescape-api/osrs";
import asyncBatch from "async-batch";
import { AxiosError } from "axios";
import { ItemRecord } from "../utils/types";
import {
  loadBadItems,
  loadCompletedItems,
  loadRawItemIds,
  writeBadItemData,
  writeItemData,
} from "../utils/file";
import sleep from "../utils/sleep";
import { difference } from "../utils/set";

const CONCURRENCY_LIMIT = 1;
const THROTTLE_WAIT = 500;
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
        return;
      } else {
        await sleep(60000);
      }
      tries++;
    }
  } while (tries < 5);
  return undefined;
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

function sortItems(items: ItemRecord) {
  return Object.keys(items)
    .sort()
    .reduce((obj, key) => {
      obj[parseInt(key)] = items[parseInt(key)];
      return obj;
    }, {} as ItemRecord);
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
        writeBadItemData([...badItemIds, ...badIds]);
      }

      await sleep(THROTTLE_WAIT);
    },
    CONCURRENCY_LIMIT
  );

  console.log(
    `Finished looking up items. Found ${Object.keys(items).length} items`
  );

  writeItemData(sortItems(items));
  writeBadItemData([...badItemIds, ...badIds]);
}

(async () => {
  await main();
})();
