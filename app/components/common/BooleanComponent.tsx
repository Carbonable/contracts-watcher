export default function BooleanComponent({ title, text, value }: { title: string, text: string, value?: boolean }) {

    if (value === undefined) {
        return (
            <div className="text-ellipsis overflow-hidden text-neutral-300 my-2 flex items-center">
                <div>{title}: </div>
                <div className={`text-neutral-50 py-1 px-2 ml-2 rounded-xl text-sm bg-gray-500`}>{text}</div>
            </div>
        )
    }

    return (
        <div className="text-ellipsis overflow-hidden text-neutral-300 my-2 flex items-center">
            <div>{title}: </div>
            <div className={`text-neutral-50 py-1 px-2 ml-2 rounded-xl text-sm ${value ? "bg-greenish-500" : "bg-red-500"}`}>{text}</div>
        </div>
    )
}