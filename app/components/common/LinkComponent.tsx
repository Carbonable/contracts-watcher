import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

export default function LinkComponent({ href, title }: { href: string, title: string }) {
    return (
        <div className="text-ellipsis overflow-hidden text-neutral-300 flex items-center">
            <div>{title}: </div>
            <div className="text-neutral-100 hover:text-neutral-50 flex items-center ml-2">
                <a href={href} target="_blank" rel="noreferrer" className="hover:underline">{href}</a>
                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 cursor-pointer" />
            </div>
        </div>
    )
}

export function ContractLinkComponent({ href, title, address }: { href: string, title: string, address: string }) {
    return (
        <div className="text-ellipsis overflow-hidden text-neutral-300 flex items-center">
            <div>{title}: </div>
            <div className="text-neutral-100 hover:text-neutral-50 flex items-center ml-2 overflow-hidden text-ellipsis">
                <a href={href} target="_blank" rel="noreferrer" className="hover:underline overflow-hidden text-ellipsis">{address}</a>
                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 cursor-pointer min-w-[16px]" />
            </div>
        </div>
    )
}