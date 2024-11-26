export function ProjectDetailSkeleton() {
  return (
      <div className="animate-pulse">
          <div className="w-full flex flex-wrap">
              {/* Image Skeleton */}
              <div className="w-full md:w-1/3">
                  <div className="bg-neutral-500 opacity-5 aspect-square w-full"></div>
              </div>
              
              {/* Project Info Skeleton */}
              <div className="w-full md:w-2/3 md:px-8 mt-4 md:mt-0">
                  <div className="space-y-4">
                      <div className="h-8 bg-neutral-400 opacity-10 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-400 opacity-10 rounded w-1/2"></div>
                      <div className="h-4 bg-neutral-400 opacity-10 rounded w-full"></div>
                      <div className="h-4 bg-neutral-400 opacity-10 rounded w-5/6"></div>
                  </div>
              </div>
              
              {/* Project Metadata Skeleton */}
              <div className="w-full ml-1 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="bg-neutral-400 opacity-10 h-20 rounded"></div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Contracts Information Skeleton */}
          <div className="w-full mt-8">
              <div className="h-10 bg-neutral-500 opacity-10 rounded w-1/2 mb-4"></div>
              <div className="bg-neutral-400 opacity-10 p-4 rounded">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="bg-neutral-400 opacity-10 h-12 rounded"></div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Migration Status Skeleton */}
          <div className="w-full mt-8">
              <div className="h-10 bg-neutral-400 opacity-10 rounded w-1/2 mb-4"></div>
              <div className="bg-neutral-500 opacity-10 p-4 rounded">
                  <div className="space-y-4">
                      <div className="h-6 bg-neutral-400 opacity-10 rounded w-full"></div>
                      <div className="h-6 bg-neutral-400 opacity-10 rounded w-5/6"></div>
                      <div className="h-6 bg-neutral-400 opacity-10 rounded w-3/4"></div>
                  </div>
              </div>
          </div>

          {/* Analytics Skeleton */}
          <div className="w-full mt-8">
              <div className="h-10 bg-neutral-500 opacity-10 rounded w-1/2 mb-4"></div>
              <div className="bg-neutral-400 opacity-10 p-4 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((item) => (
                          <div key={item} className="bg-neutral-400 opacity-10 h-40 rounded"></div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
}