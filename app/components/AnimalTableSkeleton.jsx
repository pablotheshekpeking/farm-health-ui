export function AnimalTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="border-b bg-muted/5 p-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1">
                <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rows skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="flex-1">
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted"></div>
              </div>
              <div className="flex justify-end flex-1">
                <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 