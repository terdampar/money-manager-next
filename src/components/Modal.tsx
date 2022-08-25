import { motion } from 'framer-motion'
import { HTMLAttributes, ReactNode } from 'react'

export function Modal(props: { title: string, children?: ReactNode, isShowing: boolean, close: () => void, className?: HTMLAttributes<HTMLDivElement> | string }) {
    function Header() {
        return (
            <div className='flex content-between '>
                <h3 className='p-4 mr-auto font-semibold text-lg sm:text-2xl '>{props.title}</h3>
                <button className='p-2 mx-2 my-auto button hover:bg-stone-100 active:bg-stone-200' onClick={props.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="button h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <motion.div className='fixed flex w-screen h-screen inset-0 bg-black/30' aria-hidden={props.isShowing} onClick={props.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
        >
            <motion.div className='bg-white max-w-md m-auto shadow-xl rounded' onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, }}
                animate={{ scale: 1, }}
                exit={{ scale: 0.8, }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <Header />
                {props.children}
            </motion.div>
        </motion.div>

    )
}