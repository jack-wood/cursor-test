import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { JobBoard } from "./_components/job-board";
import { JobBoardSkeleton } from "./_components/job-board-skeleton";

export default function HomePage() {
  // Prefetch initial job search
  prefetch(
    trpc.job.search.queryOptions({
      page: 1,
      limit: 10,
      sortBy: "date",
    }),
  );

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-50">
        <JobBoard />
      </main>
    </HydrateClient>
  );
}
