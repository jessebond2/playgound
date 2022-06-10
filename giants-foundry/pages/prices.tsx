import type { NextPage } from "next";
import Head from "next/head";
import { grandexchange } from "runescape-api/osrs";

const Prices: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>OSRS Prices</title>
        <meta name="description" content="Prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Prices</h1>
        <div>{JSON.stringify(props)}</div>
      </main>
    </div>
  );
};

async function fetchResult(id: number) {
  try {
    return grandexchange.getItem(id);
  } catch (e) {
    return {};
  }
}

export async function getServerSideProps() {
  const results = await Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(fetchResult)
  );

  return {
    props: { results },
  };
}

export default Prices;
