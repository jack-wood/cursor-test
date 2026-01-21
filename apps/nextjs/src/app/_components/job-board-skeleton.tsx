export function JobBoardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mb-4 flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-6 w-20 animate-pulse rounded-full bg-gray-200"
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="ml-4">
              <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
