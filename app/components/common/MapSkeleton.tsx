export default function MapSkeleton() {
    return (
        <div className="bg-neutral-500 opacity-10 border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="w-full aspect-square bg-neutral-400 opacity-10 md:w-1/3 sm:w-2/3"></div>

            {/* Project Details Skeleton */}
            <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-400 opacity-10 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-400 opacity-10 rounded w-1/2"></div>
            </div>
        </div>
    );
}