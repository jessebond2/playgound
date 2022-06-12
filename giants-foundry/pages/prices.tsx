import type { NextPage } from "next";
import Head from "next/head";
import {
  WikiMapping,
  WikiPriceRecord,
} from "../utils/types";
import { getItemMapping, getLatest } from "../api/runescape-wiki";
import { useCallback, useState } from "react";

const RENDER_LIMIT = 100;

interface PricesProps {
  items: WikiMapping[];
  latestPrices: WikiPriceRecord;
}

const Prices: NextPage<PricesProps> = ({ items, latestPrices }) => {
  const [filter, setFilter] = useState("");
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);
    },
    [setFilter]
  );
  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(filter))
    .slice(0, RENDER_LIMIT);

  return (
    <div>
      <Head>
        <title>OSRS Prices</title>
        <meta name="description" content="Prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Prices</h1>
        <input
          value={filter}
          onChange={handleSearch}
          placeholder="Search for Item"
          type="text"
        />
        <div>
          {filteredItems.map((item: WikiMapping) => {
            console.log("item", item, "price", latestPrices[item.id]);
            return (
              <div key={item.id}>
                <span>{item.name}, </span>
                <span>Id: {item.id}, </span>
                <span>
                  Current Price:{" "}
                  {latestPrices[item.id] ? latestPrices[item.id].high : -1}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const itemMapping = await getItemMapping();
  const latestPrices = await getLatest();
  const id = Object.values(itemMapping)[0].id;

  return {
    props: { items: Object.values(itemMapping), latestPrices },
  };
}

export default Prices;
