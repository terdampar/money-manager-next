import { Group, Journal, JournalType, Space } from "@prisma/client";
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { convertDateFull } from "../library/convertDate";
import Header from "../components/Header";
import { getSession, GetSessionParams } from "next-auth/react";
import { config } from "../server/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Icon from "../components/icons";
import { Modal } from "../components/Modal";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

interface HomeProps {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  group: Group
  journal: Journal[]
}

export default function Home() {
  const { data, status } = useQuery(["space"], () => {
    return axios.get<HomeProps[]>(config + '/api/v1/journal');
  });

  const [modalCreateJournal, setModalCreateJournal] = useState(false);
  const [submit, setSubmit] = useState(false)

  const [spaceName, setSpaceName] = useState("");

  const [groupId, setGroupId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState<JournalType>("Expense");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");

  const [space, setSpace] = useState("");

  function submitCreateJournal(e: any) {
    e.preventDefault();
    setSubmit(true);

    axios.post(config + '/api/v1/journal/create', {
      groupId: groupId,
      name: name,
      description: description,
      type: type,
      amount: amount,
      total: total,
      space: space,
    }).then(res => {
      console.log(res);
    }
    ).catch(err => {
      console.log(err);
    }).finally(() => {
      setSubmit(false);
      setModalCreateJournal(false);
    });
    resetForm();
  }
  function resetForm() {
    setGroupId("");
    setName("");
    setDescription("");
    setType("Expense");
    setAmount("");
    setTotal("");
    setSpace("");
  }


  return (
    <>
      <Head>
        <title>Money Manager</title>
        <meta name="description" content="Your money management suck!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header text="Journal" />
      <h2 className="font-bold text-2xl p-2"></h2>
      {status === 'loading' ?
        <p>Loading...</p>
        : status === 'error' ?
          <p>Error</p>
          : status === 'success' ?
            <div>
              {data?.data.length === 0 &&
                <div className="p-2">
                  <p className="text-center">No space found, you need to create space first!</p>
                  <Link href="/space">
                    <a className="mx-auto mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-100 active:bg-gray-300 text-center">Go to Space</a>
                  </Link>
                </div>
              }
              {data?.data.map(space => (
                <JournalItem
                  key={space.id}
                  space={space}
                  add={() => {
                    setModalCreateJournal(true);
                    setSpace(space.id)
                    setSpaceName(space.name)
                    setGroupId(space.group.id)
                  }}
                  delete={() => console.log("delete")}
                />
              ))}
            </div>
            : null
      }
      <AnimatePresence exitBeforeEnter>
        {modalCreateJournal &&
          <Modal
            title={"Add Journal in " + `"` + spaceName + `"`}
            close={() => setModalCreateJournal(false)}
            isShowing={modalCreateJournal}
            className='max-w-2xl'
          >
            <form autoComplete="off" onSubmit={(e) => submitCreateJournal(e)}>
              <div className='p-4 space-y-4 w-96'>
                <div>
                  <p>Name</p>
                  <input required autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='e.g. Ice Cream' />
                </div>
                <div>
                  <p>Description</p>
                  <input autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Optional' />
                </div>
                <div>
                  <p>Type</p>
                  <div className="grid grid-flow-col gap-2">
                    <button className={'rounded col-span-1 inset-0 border border-gray-300 box-border p-2 font-bold ' + (type === "Expense" ? 'bg-sky-200 border-dashed border-sky-500' : 'bg-stone-200 hover:bg-stone-100')} type='button' onClick={() => setType("Expense")}>Expense</button>
                    <button className={'rounded col-span-1 inset-0 border border-gray-300 box-border p-2 font-bold ' + (type === "Income" ? 'bg-sky-200 border-dashed border-sky-500' : 'bg-stone-200 hover:bg-stone-100')} type='button' onClick={() => setType("Income")}>Income</button>
                  </div>
                </div>
                <div>
                  <p>Amount</p>
                  <input required className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="number" pattern="[0-9]*" onChange={(e) => setAmount(e.target.value)} value={amount} placeholder='0' />
                </div>
                <div>
                  <p>Total</p>
                  <input required autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setTotal(e.target.value)} value={total} placeholder='0' />
                </div>
              </div>
              <div className='space-x-2 flex w-auto p-4'>
                <button type='button' className='p-2 button border box-border border-stone-400 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 w-full' onClick={() => setModalCreateJournal(false)}>Cancel</button>
                <button type='submit' className='p-2 button bg-sky-700 hover:bg-sky-800 active:bg-sky-900 w-full text-white'>
                  <span className='flex mx-auto w-fit space-x-2'>
                    {submit &&
                      <svg className="animate-spin h-5 w-5 my-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    <p>Add</p>
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        }
      </AnimatePresence>
      <Toaster />
    </>
  );
};

function JournalItem(props: { space: HomeProps, add: () => void, delete: () => void }) {
  return (
    <details className="bg-gray-50 hover:bg-gray-100 m-2 rounded p-2 border border-gray-100" open>
      <summary className="flex">
        <div className="block">
          <p className="font-medium mr-2 text-lg text-gray-800 my-auto">{props.space.name}</p>
          <p className="text-gray-600">{props.space.description || "No desc"}</p>
        </div>
        <button className="h-fit my-auto ml-auto bg-gray-200 hover:bg-gray-100 border border-gray-300 text-gray-700 active:brightness-90 flex p-2 rounded" onClick={props.add}>
          <Icon.Add />
        </button>
      </summary>
      <ul className="mt-2">
        {props?.space?.journal?.map(journal => (
          <li className="flex bg-white p-2 mb-1 border border-gray-200 rounded">
            <p className="text-gray-600 my-auto px-4 text-right">{journal.amount}</p>
            <div>
              <p className="text-gray-800 font-medium">{journal.name}</p>
              <p className="text-gray-600 text-sm">{journal.description + (journal.description && ' • ') + convertDateFull(journal.createdAt)}</p>
              <p className="ml-1 text-sm my-auto"></p>
            </div>
            <p className={"ml-auto my-auto " + (journal.type === 'Expense' ? 'text-red-700' : journal.type === 'Income' ? 'text-green-700' : 'text-gray-600')}>{journal.type === 'Expense' ? '-' : journal.type === 'Income' ? '+' : ''}Rp{Intl.NumberFormat(['ban', 'id']).format(journal.total)}</p>
          </li>
        ))}
        {props?.space?.journal?.length === 0 &&
          <li className="bg-white p-2 mb-1 border border-gray-200 rounded">
            <p className="text-center italic text-gray-600">No Item</p>
          </li>
        }
      </ul>
    </details>
  )
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }
  }
  return {
    props: {
      // data: data
    }
  }
}