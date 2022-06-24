import type { NextPage } from "next";
import Head from "next/head";
import { WikiMapping, WikiPriceRecord } from "../utils/types";
import { getItemMapping, getLatest } from "../api/runescape-wiki";
import React, { useCallback, useState } from "react";
import { Header } from "../components/header";

const RENDER_LIMIT = 100;
const foundryRegex =
  /(Bronze|Iron|Steel|Mithril|Adamant|Rune) (2h sword|battleaxe|chainbody|claws|full helm|kiteshield|longsword|platebody|platelegs|plateskirt|scimitar|sq shield|warhammer)$/i;
const metalBarRegex = /(Bronze|Iron|Steel|Mithril|Adamantite|Runite) bar/i;

interface PricesProps {
  items: WikiMapping[];
  latestPrices: WikiPriceRecord;
}

const Prices: NextPage<PricesProps> = ({ items, latestPrices }) => {
  const [filter, setFilter] = useState("");
  const [blockedIds, setBlockedIds] = useState<number[]>([]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);
    },
    [setFilter]
  );
  const handleClickBlockId = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setBlockedIds([
        ...blockedIds,
        parseInt(e.currentTarget.getAttribute("data-id") as string),
      ]);
    },
    [blockedIds]
  );
  const handleReset = useCallback(() => {
    setFilter("");
    setBlockedIds([]);
  }, []);
  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(filter))
    //.filter((item) => metalBarRegex.test(item.name))
    .filter((item) => !blockedIds.includes(item.id));

  const handleCopy = useCallback(() => {
    const text = filteredItems
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((item) => `${item.id}: '${item.name}'`)
      .join(",\n");
    console.log(text);
    navigator.clipboard.writeText(text);
  }, [filteredItems]);

  return (
    <div>
      <Head>
        <title>OSRS Prices</title>
        <meta name="description" content="Prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <h1>Prices</h1>
        <div>
          <input
            value={filter}
            onChange={handleSearch}
            placeholder="Search for Item"
            type="text"
          />
          <button onClick={handleCopy}>Copy Results</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div>
          {filteredItems.slice(0, RENDER_LIMIT).map((item: WikiMapping) => (
            <div key={item.id}>
              <span>{item.name}, </span>
              <span>Id: {item.id}, </span>
              <span>
                Current Price:{" "}
                {latestPrices[item.id] ? latestPrices[item.id].high : -1}
              </span>
              <button data-id={item.id} onClick={handleClickBlockId}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const itemMapping = await getItemMapping();
  const latestPrices = await getLatest();

  return {
    props: { items: Object.values(itemMapping), latestPrices },
  };
}

export default Prices;
