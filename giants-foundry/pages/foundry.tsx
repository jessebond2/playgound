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
        <h1>Giant&apos;s Foundry calculator</h1>
        <div className={styles.contentWrapper}>
          {Object.entries(itemPrices).map(([key, priceRecord]) => (
            <table key={key} className={styles.tableWrapper}>
              <caption>
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
              <tbody>
                {Object.entries(priceRecord).map(([id, item]) => (
                  <tr key={id} className={item.lowest ? styles.lowest : ""}>
                    <td>{item.name}</td>
                    <td>{item.price}gp</td>
                    <td>{item.recycledBars}</td>
                    <td>{item.pricePerBar}gp</td>
                    <td>
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
