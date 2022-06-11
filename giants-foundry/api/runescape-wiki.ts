import axios from "axios";

// https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices
export const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
export const ROUTES = {
  LATEST: "/latest",
  MAPPING: "/mapping",
  FIVE_MINUTE: "/5m",
  ONE_HOUR: "/1h",
  TIME_SERIES: "/timeseries",
};

type WikiItem = {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
};

type ItemMapping = {
  examine: string;
  id: number;
  members: boolean;
  lowalch: number;
  highalch: number;
  icon: string;
  name: string;
};

type LatestResponse = Record<string, WikiItem>;
type ItemMappingResponse = [ItemMapping];

const userAgent = `Giant's Foundry calculator - ${process.env.DISCORD_USER}`;
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": userAgent,
  },
});
console.info(`runescape-wiki api instantiated with User-Agent: ${userAgent}`);

export async function getLatest() {
  return instance.get<LatestResponse>(ROUTES.LATEST, {
    transformResponse: (res) => res.data,
  });
}

export async function getItemMapping() {
  return instance.get<ItemMappingResponse>(ROUTES.LATEST);
}
