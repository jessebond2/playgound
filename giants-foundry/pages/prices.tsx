import type { NextPage } from "next";
import Head from "next/head";
import { Item } from "runescape-api/lib/RuneScape";
import { ItemRecord } from "../utils/types";
import itemIds from "../data/itemIds.json";

interface PricesProps {
  items: ItemRecord;
}

const Prices: NextPage<PricesProps> = ({ items }) => {
  return (
    <div>
      <Head>
        <title>OSRS Prices</title>
        <meta name="description" content="Prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Prices</h1>
        <div>
          {Object.values(items).map((item: Item) => (
            <div key={item.id}>
              <span>Id: {item.id}, </span>
              <span>Name: {item.name}, </span>
              <span>Current Price: {item.trends.current.price}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const items = itemIds;
  

  return {
    props: { items },
  };
}

export default Prices;
