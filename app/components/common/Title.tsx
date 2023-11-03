export function Title({ title, icon }: { title: string, icon: string }) {
    return (
        <div className="text-xl font-bold uppercase mt-12 pb-4 border-b border-neutral-600">
            {icon} {title}
        </div>
    )
}

export function Subtitle({ title }: { title: string }) {
    return (
        <div className="text-lg font-semibold uppercase mt-4 pb-2 text-neutral-200">
            {title}
        </div>
    )
}

export function ChartsDescription({children}: {children: React.ReactNode}) {
    return (
        <div className="text-neutral-300 mb-8 text-base">
            {children}
        </div>
    )
}