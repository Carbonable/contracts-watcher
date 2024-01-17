export default function Card({ collectionId }: { collectionId: string }) {
    return (
        <div className="w-full px-8 py-6 border border-neutral-600 rounded-lg bg-opacityLight-5">
            <img src={`/assets/images/collections/${collectionId}.svg`} alt={collectionId} className="w-full" />
        </div>
    )
}