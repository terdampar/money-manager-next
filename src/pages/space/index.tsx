import { Group, Member, Space } from "@prisma/client";
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { convertDate } from "../../library/convertDate";
import Header from "../../components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "../../components/Modal";
import toast, { Toaster } from "react-hot-toast";
import { config } from "../../server/config";
import { getSession, GetSessionParams, useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Icon from "../../components/icons";

// Types
interface SpaceProps {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  group: {
    id: string
    code: string
    member: {
      role: string
    }[],
  }
}

export default function SpacePage() {
  const { data, status, error } = useQuery(["space"], () => {
    return axios.get<SpaceProps[]>(config + '/api/v1/space');
  });

  const { data: rename, status: statusEdit, error: errorEdit } = useMutation(() => {
    return axios.post(config + '/api/v1/space/rename');
  }, {
    onSuccess: () => {
      toast.success("Space updated successfully");
    }
  });
  const [modalJoinSpace, setModalJoinSpace] = useState(false);
  const [spaceCode, setSpaceCode] = useState("")
  const [modalShareSpace, setModalShareSpace] = useState(false);

  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDescription, setNewSpaceDescription] = useState("");
  const [submit, setSubmit] = useState(false);
  const [modalNewSpace, setModalNewSpace] = useState(false);
  const [spaceId, setSpaceId] = useState<Space["id"]>("");
  const [spaceName, setSpaceName] = useState<Space["name"]>("");
  const [modalDeleteSpace, setModalDeleteSpace] = useState(false);

  function submitCreateSpace(e: any) {
    e.preventDefault();
    if (newSpaceName === "") {
      toast.error("Please enter a name for the space");
    } else if (data?.data.find(g => g.name === newSpaceName)) {
      toast.error('Space already exists.');
    } else {
      setSubmit(true);
      axios.post(config + '/api/v1/space/create', {
        name: newSpaceName,
        description: newSpaceDescription
      })
        .then(res => {
          // res.status === 200 && setData([...data, res.data])
          toast.success('Space added.');
        })
        .catch(err => {
          console.log(err)
          toast.error('Error creating space.')
        })
        .finally(() => {
          setNewSpaceName('')
          setNewSpaceDescription('')
          setModalNewSpace(false)
          setSubmit(false);
        })
    }
  }
  function submitDeleteSpace(id: string) {
    if (id) {
      setSubmit(true);
      axios.post<Space>(config + '/api/v1/space/delete', {
        id: id,
      })
        .then(res => {
          // res.status === 200 && setData(data.filter(item => item.id !== res.data.id))
          toast.success('Space ' + res.data.name + ' Deleted.');
        })
        .catch(err => {
          console.log(err)
          toast.error('Error deleting space.')
        })
        .finally(() => {
          setSpaceId("")
          setSpaceName("")
          setModalDeleteSpace(false)
          setSubmit(false);
        })
    } else {
      toast.error('Error deleting space.')
    }
  }

  function submitJoinSpace(e: any) {
    e.preventDefault();
    if (spaceCode) {
      setSubmit(true);
      axios.post(config + '/api/v1/space/join', {
        spaceCode: spaceCode
      })
        .then(res => {
          toast.success('Space joined.');
        })
        .catch(err => {
          toast.error(err)
          toast.error('Error joining space.')
        })
        .finally(() => {
          setSpaceCode("")
          setModalJoinSpace(false)
          setSubmit(false);
        })
    } else {
      toast.error('Please enter a space code.')
    }
  }

  return (
    <>
      <Head>
        <title>Money Space</title>
        <meta name="description" content="Your money management suck!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header text="Money Space" />
      <div className="flex m-2">
        <h2 className="font-bold text-2xl mr-auto">My Space</h2>
        <div className="space-x-2">
          <button className="p-2 rounded bg-gray-200" onClick={() => setModalNewSpace(true)}>+ New</button>
          <button className="p-2 rounded bg-gray-200" onClick={() => {setSpaceCode(""); setModalJoinSpace(true)}}>Join</button>
        </div>
      </div>
      {status === 'loading' ?
        <p>Loading...</p>
        : status === 'error' ?
          <p>Error</p>
          : null
      }

      {status === 'success' && data?.data.map(space => (
        <motion.div>
          <SpaceItem
            key={space.id}
            space={space}
            delete={() => {
              setSpaceId(space.id)
              setSpaceName(space.name)
              setModalDeleteSpace(true)
            }}
            share={() => {
              setModalShareSpace(true)
              setSpaceName(space.name)
              setSpaceCode(space.group.code)
            }}
          />
        </motion.div>
      ))}

      <h2 className="font-bold text-2xl p-2">Shared Space</h2>
      <AnimatePresence exitBeforeEnter>
        {modalNewSpace &&
          <Modal
            title="New Space"
            close={() => setModalNewSpace(false)}
            isShowing={modalNewSpace}
            className='max-w-2xl'
          >
            <form autoComplete="off" onSubmit={(e) => submitCreateSpace(e)}>
              <div className='p-4 space-y-4 w-96'>
                <div>
                  <p>Name</p>
                  <input required autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setNewSpaceName(e.target.value)} value={newSpaceName} placeholder='e.g. Home, Office, Transportation' />
                </div>
                <div>
                  <p>Description</p>
                  <input autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setNewSpaceDescription(e.target.value)} value={newSpaceDescription} placeholder='Optional description' />
                </div>
              </div>
              <div className='space-x-2 flex w-auto p-4'>
                <button type='button' className='p-2 button border box-border border-stone-400 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 w-full' onClick={() => setModalNewSpace(false)}>Cancel</button>
                <button type='submit' className='p-2 button bg-sky-700 hover:bg-sky-800 active:bg-sky-900 w-full text-white'>
                  <span className='flex mx-auto w-fit space-x-2'>
                    {submit &&
                      <svg className="animate-spin h-5 w-5 my-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    <p>Create</p>
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        }
        {modalDeleteSpace &&
          <Modal
            title='Delete Confirmation'
            isShowing={modalDeleteSpace}
            close={() => setModalDeleteSpace(false)}
            className='max-w-2xl'
          >
            <form onSubmit={() => submitDeleteSpace(spaceId)}>
              <div className='p-4 space-y-4 w-96'>
                <p>Are you sure to delete <strong>{spaceName}</strong>?</p>
              </div>
              <div className='space-x-2 flex w-auto p-4'>
                <button type='button' className='p-2 button border box-border border-stone-400 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 w-full' onClick={() => setModalDeleteSpace(false)}>Cancel</button>
                <button type='submit' className='p-2 button bg-red-700 hover:bg-red-800 active:bg-red-900 w-full text-white'>
                  <span className='flex mx-auto w-fit space-x-2'>
                    {submit &&
                      <svg className="animate-spin h-5 w-5 my-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    <p>Delete</p>
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        }
        {modalJoinSpace &&
          <Modal
            title='Join Space'
            isShowing={modalJoinSpace}
            close={() => setModalJoinSpace(false)}
            className='max-w-2xl'
          >
            <form onSubmit={(e) => submitJoinSpace(e)}>
              <div className='p-4 w-96'>
                <div className=" space-y-2">
                  <p>Paste code below to join space.</p>
                  <input required autoComplete="off" className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-white' type="text" onChange={(e) => setSpaceCode(e.target.value)} value={spaceCode} placeholder='Space Code' />
                </div>
              </div>
              <div className='space-x-2 flex w-auto p-4'>
                <button type='button' className='p-2 button border box-border border-stone-400 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 w-full' onClick={() => setModalJoinSpace(false)}>Cancel</button>
                <button type='submit' className='p-2 button bg-sky-700 hover:bg-sky-800 active:bg-sky-900 w-full text-white'>
                  <span className='flex mx-auto w-fit space-x-2'>
                    {submit &&
                      <svg className="animate-spin h-5 w-5 my-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    <p>Join</p>
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        }
        {modalShareSpace &&
          <Modal
            title='Share Space'
            isShowing={modalShareSpace}
            close={() => setModalShareSpace(false)}
            className='max-w-2xl'
          >
            <form onSubmit={(e) => { e.preventDefault(); setModalShareSpace(false) }}>
              <div className='p-4 w-96 space-y-2'>
                <p>Copy code below to share space <strong>{spaceName}</strong> with friends or family!</p>
                <input readOnly className='w-full focus:outline-none p-2 max-w-screen-2xl border border-gray-300 rounded-sm bg-gray-100' type="text" value={spaceCode} placeholder='Space Code' />
              </div>
              <div className='space-x-2 flex w-auto p-4'>
                <button type='button' className='p-2 button border box-border border-stone-400 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 w-full' onClick={() => setModalDeleteSpace(false)}>Cancel</button>
                <button type='submit' className='p-2 button bg-sky-700 hover:bg-sky-800 active:bg-sky-900 w-full text-white'>
                  <p>Ok</p>
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

function SpaceItem(props: { space: SpaceProps, delete: () => void, share: () => void }) {
  const accessLevel = props?.space?.group
  return (
    <div className="bg-gray-50 hover:bg-gray-100 duration-150 m-2 rounded p-4 border border-gray-100">
      <div className="flex">
        <p className="font-medium text-lg text-gray-800 my-auto mr-2">{props.space.name}</p>
        {accessLevel.member && accessLevel.member.map(role => {
          return <p className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-full h-fit my-auto space-x-1">{role.role}</p>
        })}
        <div className="ml-auto flex my-auto px-2 py-1 text-sm bg-gray-200 rounded-full text-green-700">
          <Icon.Refresh />
          <p className="ml-1 text-sm my-auto">{convertDate(props.space.updatedAt)}</p>
        </div>
      </div>
      <p className="text-gray-600">{props.space.description || "No desc"}</p>
      <div className="ml-auto flex w-min space-x-2">
        <button className=" bg-gray-200 hover:bg-gray-100 border border-gray-300 text-gray-700 active:brightness-90 flex p-2 rounded" onClick={props.delete}>
          <Icon.Delete />
        </button>
        {/* <button className="bg-gray-200 hover:bg-gray-100 border border-gray-300 text-gray-700 active:brightness-90 flex p-2 rounded" onClick={props.delete}>
          <Icon.Edit />
        </button> */}
        <button className="bg-gray-200 hover:bg-gray-100 border border-gray-300 text-gray-700 active:brightness-90 flex p-2 rounded" onClick={props.share}>
          <Icon.Share />
        </button>
      </div>
    </div>
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

    }
  }
}


