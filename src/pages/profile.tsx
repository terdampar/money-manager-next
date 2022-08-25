import { Space } from "@prisma/client";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { getSession, GetSessionParams, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Your money management suck!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header text="Profile" />
      {session ?
        <div className="mx-auto w-fit">
          <div className="mx-auto aspect-square w-32 h-32">
            <Image className="rounded-full " src={session?.user?.image || "/"} alt="avatar" width={200} height={200} />
          </div>
          <h2 className="font-bold text-2xl p-2 text-center">{session?.user?.name}</h2>
          <h2 className="font-medium te p-2 text-center text-gray-600">{session?.user?.email}</h2>
          <button className="button-basic" onClick={() => signOut()}>Sign Out</button>
        </div>
        :
        <div className="mx-auto w-fit">
          <button className="button-basic" onClick={() => signIn()}>Sign In with Discord</button>
        </div>
      }
    </>
  );
};