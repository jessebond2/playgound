import type { NextPage } from "next";
import Head from "next/head";
import { WikiPriceRecord } from "../utils/types";
import { getLatest } from "../api/runescape-wiki";
import React from "react";
import { Header } from "../components/header";
import { bars, Metals } from "../constants/bars";
import {
  adamant,
  bronze,
  FoundryMetal,
  iron,
  mithril,
  rune,
  steel,
} from "../constants/foundryItems";
import styles from "../styles/foundry.module.css";

type PriceRecord = Record<
  number,
  {
    name: string;
    price: number;
    recycledBars?: number;
    pricePerBar: number;
    lowest?: boolean;
  }
>;
function mapBarPrices(items: Record<number, string>, prices: WikiPriceRecord) {
  const result: PriceRecord = {};
  for (let id in items) {
    result[id] = {
      name: items[id],
      price: prices[id].low,
      pricePerBar: prices[id].low,
    };
  }

  return result;
}

function mapItemPrices(items: FoundryMetal, prices: WikiPriceRecord) {
  const result: PriceRecord = {};
  let lowest = Infinity;
  let lowestId = -1;

  for (let id in items) {
    result[id] = {
      name: items[id].name,
      price: prices[id].low,
      recycledBars: items[id].recycledBars,
      pricePerBar: Math.ceil(prices[id].low / items[id].recycledBars),
    };

    if (result[id].pricePerBar < lowest) {
      lowest = result[id].pricePerBar;
      lowestId = parseInt(id);
    }
  }

  for (let id in result) {
    result[id].lowest = lowestId === parseInt(id);
  }

  return result;
}

interface Foundry {
  barPrices: PriceRecord;
  itemPrices: Record<Metals, PriceRecord>;
}

const Foundry: NextPage<Foundry> = ({ barPrices, itemPrices }) => {
  return (
    <div>
      <Head>
        <title>OSRS Giant&apos;s Foundry calculator</title>
        <meta name="description" content="Giant's Foundry calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <h1 className="font-sans text-slate-900 text-xl">
          Giant&apos;s Foundry calculator
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(itemPrices).map(([key, priceRecord]) => (
            <table key={key} className="p-2 box-border outline outline-2">
              <caption className="text-slate-800 text-lg">
                {bars[key as unknown as Metals]}:{" "}
                {barPrices[key as unknown as Metals].price}gp
              </caption>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Number of Bars</th>
                  <th>Price per Bar</th>
                  <th>Delta</th>
                </tr>
              </thead>
              <tbody className="">
                {Object.entries(priceRecord).map(([id, item]) => (
                  <tr key={id} className={item.lowest ? "bg-green-400" : ""}>
                    <td className="font-mono text-slate-600">{item.name}</td>
                    <td className="font-mono text-slate-600">{item.price}gp</td>
                    <td className="font-mono text-slate-600">
                      {item.recycledBars}
                    </td>
                    <td className="font-mono text-slate-600">
                      {item.pricePerBar}gp
                    </td>
                    <td className="font-mono text-slate-600">
                      {barPrices[parseInt(key)].price - (item.pricePerBar || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const latestPrices = await getLatest();
  const barPrices: PriceRecord = mapBarPrices(bars, latestPrices);
  const itemPrices: Record<Metals, PriceRecord> = {
    [Metals.BRONZE]: mapItemPrices(bronze, latestPrices),
    [Metals.IRON]: mapItemPrices(iron, latestPrices),
    [Metals.STEEL]: mapItemPrices(steel, latestPrices),
    [Metals.MITHRIL]: mapItemPrices(mithril, latestPrices),
    [Metals.ADAMANT]: mapItemPrices(adamant, latestPrices),
    [Metals.RUNE]: mapItemPrices(rune, latestPrices),
  };

  return {
    props: { barPrices, itemPrices },
  };
}

export default Foundry;
