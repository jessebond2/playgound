import { Item } from "runescape-api/lib/RuneScape";

export type ItemRecord = Record<number, Item>;

export type WikiPriceRecord = Record<string, WikiPrice>;
export type WikiPrice = {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
};

export type WikiMappingRecord = Record<string, WikiMapping>;
export type WikiMapping = {
  examine: string;
  id: number;
  members: boolean;
  lowalch: number;
  highalch: number;
  icon: string;
  name: string;
};
