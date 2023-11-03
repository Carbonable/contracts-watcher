export default function LabelComponent({ title, value, error, loading }: { title: string, value?: string|undefined, error?: boolean, loading?: boolean }) {

    if (loading) {
        return (
            <div className="text-ellipsis overflow-hidden text-neutral-300 mt-1">
                <span>{title}: </span>
                <span className="text-neutral-200">Loading...</span>
            </div>
        )
    }

    if (error)  {
        return (
            <div className="text-ellipsis overflow-hidden text-neutral-300 mt-1">
                <span>{title}: </span>
                <span className="text-red-600">Error loading {title.toLowerCase()}</span>
            </div>
        )
    }

    return (
        <div className="text-ellipsis overflow-hidden text-neutral-300 mt-1">
            <span>{title}: </span>
            <span className="text-neutral-100">{value}</span>
        </div>
    )
}