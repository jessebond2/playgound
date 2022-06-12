import axios from "axios";
import { WikiMapping, WikiPriceRecord } from "../utils/types";

// https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices
export const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
export const ROUTES = {
  LATEST: "/latest",
  MAPPING: "/mapping",
  FIVE_MINUTE: "/5m",
  ONE_HOUR: "/1h",
  TIME_SERIES: "/timeseries",
};

export type LatestResponse = {
  data: WikiPriceRecord;
};
export type ItemMappingResponse = [WikiMapping];

const userAgent = `Giant's Foundry calculator - ${process.env.DISCORD_USER}`;
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": userAgent,
  },
});
console.info(`runescape-wiki api instantiated with User-Agent: ${userAgent}`);

export function getLatest() {
  return instance
    .get<LatestResponse>(ROUTES.LATEST)
    .then((response) => response.data.data);
}

export function getItemMapping() {
  return instance
    .get<ItemMappingResponse>(ROUTES.MAPPING)
    .then((response) => response.data);
}
