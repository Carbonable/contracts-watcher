export default function ProjectCardSkeleton() {
  return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
          {/* Image Placeholder */}
          <div className="w-full aspect-square bg-gray-300"></div>
          
          {/* Project Details Skeleton */}
          <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
      </div>
  );
}