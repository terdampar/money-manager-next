import type { NextPage } from "next";
import Head from "next/head";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Money Manager</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="bg-white shadow" title="Header">
          <h1 className="font-bold text-center text-violet-700 p-4">Atur Keuangan</h1>
        </div>

      </main>
    </>
  );
};

export default Home;