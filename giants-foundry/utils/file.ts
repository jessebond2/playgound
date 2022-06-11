import { createWriteStream, createReadStream } from "fs";
import { join } from "path";
import { ItemRecord } from "./types";

export async function loadFile(path: string) {
  const readable = createReadStream(path, { encoding: "utf8" });
  let file = "";
  for await (const chunk of readable) {
    file += chunk;
  }
  return file;
}

export async function loadRawItemIds() {
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

export async function writeItemData(data: ItemRecord) {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "itemIds.json")
  );
  writeStream.write(JSON.stringify(data));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

export async function writeBadItemData(data: number[]) {
  const writeStream = createWriteStream(
    join(__dirname, "..", "data", "badItemIds.txt")
  );
  writeStream.write(data.sort().join(","));
  writeStream.on("finish", () => {
    console.log("Finished writing file");
    writeStream.end();
  });
}

export async function loadCompletedItems() {
  const path = join(__dirname, "..", "data", "itemIds.json");

  const file = await loadFile(path);
  const completed: ItemRecord = JSON.parse(file);

  return completed;
}

export async function loadBadItems() {
  const path = join(__dirname, "..", "data", "badItemIds.txt");

  const file = await loadFile(path);
  const completed: number[] = file.split(",").map((x) => parseInt(x));

  return completed;
}