export default function Header(props: {text: string}) {
    return (
        <div className="bg-white shadow" title="Header">
            <h1 className="font-bold text-center text-green-700 p-4">{props.text}</h1>
        </div>
    );
}