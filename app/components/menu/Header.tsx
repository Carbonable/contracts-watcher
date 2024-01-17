import { Link } from "@remix-run/react";

export default function Header() {
    return (
        <div className="w-full px-12 py-4 border-b border-b-opacityDark-80 bg-neutral-800/80 backdrop-blur-sm">
            <Link to={'/'} className="flex flex-nowrap items-start w-min">
                <div className="uppercase font-bold text-greenish-500 ml-2 pt-1 text-2xl">
                    RWA<span className="text-sm text-neutral-100">tcher</span>
                </div>
            </Link>
        </div>
    )
}