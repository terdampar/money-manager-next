import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
    return (
        <footer className='max-w-lg  mx-auto w-full fixed bottom-0 bg-white border-t'>
            <div className='grid grid-cols-3 gap-0'>
                <NavItem
                    href="/"
                    text="Home"
                    icon={<>
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </>}
                />
                <NavItem
                    href="/space"
                    text="Space"
                    icon={<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />}
                />
                <NavItem
                    href="/profile"
                    text="Profile"
                    icon={<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />}
                />
            </div>
        </footer>
    );
}
function NavItem(props: { text: string, href: string, icon?: React.ReactNode }) {
    const routes = useRouter()
    const active = props.href === routes.asPath
    return (
        <Link href={props.href} passHref>
            <a className={'flex-none cursor-pointer p-1 col-span-1 ' + (active ? ' bg-green-100 ' : 'bg-transparent')}>
                <div className='p-1 flex justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" className={"flex h-4 w-4 " + (active ? ' fill-green-700' : 'fill-gray-400')} viewBox="0 0 20 20" fill="currentColor">
                        {props?.icon}
                    </svg>
                </div>
                <p className={'text-center text-sm font-bold ' + (active ? 'text-green-700' : 'text-gray-400')}>
                    {props.text}
                </p>
            </a>
        </Link>
    )
}