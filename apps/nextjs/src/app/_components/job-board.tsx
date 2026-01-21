"use client";

import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";
import { AuthShowcase } from "./auth-showcase";
import { cn } from "~/lib/utils";

// Simple Button component
function Button({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"button"> & {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "h-9 px-4 py-2": size === "default",
          "h-8 px-3 text-xs": size === "sm",
          "h-10 px-6": size === "lg",
        },
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
          "border border-gray-300 bg-white hover:bg-gray-50": variant === "outline",
          "hover:bg-gray-100": variant === "ghost",
        },
        className,
      )}
      {...props}
    />
  );
}

// Simple Input component
function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function JobBoard() {
  const trpc = useTRPC();
  const [filters, setFilters] = useState({
    keywords: "",
    city: "",
    distance: "Any",
    ir35Status: "Any" as "Any" | "inside" | "outside",
    workLocationType: "Any" as "Any" | "remote" | "hybrid" | "onsite",
    seniority: "Any" as "Any" | "junior" | "mid" | "senior" | "lead",
    dayRateMin: undefined as number | undefined,
    dayRateMax: undefined as number | undefined,
    datePosted: "Any" as "Any" | "today" | "week" | "month",
    page: 1,
    limit: 10,
    sortBy: "date" as "date" | "salary",
  });

  const { data, isLoading } = trpc.job.search.useQuery({
    keywords: filters.keywords || undefined,
    city: filters.city !== "Any" ? filters.city : undefined,
    ir35Status:
      filters.ir35Status !== "Any" ? filters.ir35Status : undefined,
    workLocationType:
      filters.workLocationType !== "Any"
        ? filters.workLocationType
        : undefined,
    seniority: filters.seniority !== "Any" ? filters.seniority : undefined,
    dayRateMin: filters.dayRateMin,
    dayRateMax: filters.dayRateMax,
    datePosted: filters.datePosted !== "Any" ? filters.datePosted : undefined,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">&lt; &gt;</span>
          <h1 className="text-2xl font-bold">DevContracts.co.uk</h1>
        </div>
        <AuthShowcase />
      </header>

      {/* Main Content */}
      <div className="mb-8">
        <h2 className="mb-2 text-4xl font-bold">Find Your Next Contract</h2>
        <p className="text-lg text-gray-600">
          Discover UK based software development contracts
        </p>
      </div>

      {/* Search and Filter Box */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="keywords" className="text-sm font-medium">
                Keywords
              </Label.Root>
              <Input
                id="keywords"
                placeholder="e.g. frontend developer"
                value={filters.keywords}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, keywords: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="city" className="text-sm font-medium">
                City
              </Label.Root>
              <Input
                id="city"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Any"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="distance" className="text-sm font-medium">
                Distance
              </Label.Root>
              <Input
                id="distance"
                value={filters.distance}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, distance: e.target.value }))
                }
                placeholder="Any"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="ir35" className="text-sm font-medium">
                IR35 Status
              </Label.Root>
              <select
                id="ir35"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.ir35Status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    ir35Status: e.target.value as "Any" | "inside" | "outside",
                  }))
                }
              >
                <option value="Any">Any</option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="location" className="text-sm font-medium">
                Location type
              </Label.Root>
              <select
                id="location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.workLocationType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    workLocationType: e.target.value as
                      | "Any"
                      | "remote"
                      | "hybrid"
                      | "onsite",
                  }))
                }
              >
                <option value="Any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="seniority" className="text-sm font-medium">
                Seniority
              </Label.Root>
              <select
                id="seniority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.seniority}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    seniority: e.target.value as
                      | "Any"
                      | "junior"
                      | "mid"
                      | "senior"
                      | "lead",
                  }))
                }
              >
                <option value="Any">Any</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="dayRate" className="text-sm font-medium">
                Day rate
              </Label.Root>
              <select
                id="dayRate"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={
                  filters.dayRateMin || filters.dayRateMax
                    ? `${filters.dayRateMin ?? 0}-${filters.dayRateMax ?? 2000}`
                    : "Any"
                }
                onChange={(e) => {
                  if (e.target.value === "Any") {
                    setFilters((prev) => ({
                      ...prev,
                      dayRateMin: undefined,
                      dayRateMax: undefined,
                    }));
                  } else {
                    const [min, max] = e.target.value.split("-").map(Number);
                    setFilters((prev) => ({
                      ...prev,
                      dayRateMin: min,
                      dayRateMax: max,
                    }));
                  }
                }}
              >
                <option value="Any">Any</option>
                <option value="0-500">£0-£500</option>
                <option value="500-750">£500-£750</option>
                <option value="750-1000">£750-£1000</option>
                <option value="1000-1500">£1000-£1500</option>
                <option value="1500-2000">£1500-£2000</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="datePosted" className="text-sm font-medium">
                Date posted
              </Label.Root>
              <select
                id="datePosted"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.datePosted}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    datePosted: e.target.value as "Any" | "today" | "week" | "month",
                  }))
                }
              >
                <option value="Any">Any</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
        <Button onClick={handleSearch} className="mt-4">
          Search
        </Button>
      </div>

      {/* Results Summary */}
      {data && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((data.page - 1) * data.limit) + 1} -{" "}
            {Math.min(data.page * data.limit, data.total)} of {data.total}{" "}
            contracts
          </p>
          <p className="text-sm text-gray-600">Sorted by {filters.sortBy}</p>
        </div>
      )}

      {/* Job Listings */}
      {isLoading ? (
        <JobBoardSkeleton />
      ) : data && data.jobs.length > 0 ? (
        <div className="space-y-4">
          {data.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-lg text-gray-600">No jobs found</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page >= data.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
}: {
  job: {
    id: string;
    title: string;
    summary: string | null;
    city: string | null;
    salaryMax: number | null;
    workLocationType: "remote" | "hybrid" | "onsite";
    seniority: "junior" | "mid" | "senior" | "lead";
    techStack: string[] | null;
    postedAt: Date | null;
    createdAt: Date;
    contractLength: number | null;
    company: {
      name: string;
      logoUrl: string | null;
    } | null;
  };
}) {
  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-400">💼</span>
            <h3 className="text-xl font-bold">{job.title}</h3>
          </div>
          <p className="mb-2 text-sm text-gray-600">{job.company?.name}</p>
          {job.summary && (
            <p className="mb-4 line-clamp-3 text-sm text-gray-700">
              {job.summary}
            </p>
          )}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {job.workLocationType === "remote"
                ? "Remote"
                : job.workLocationType === "hybrid"
                  ? "Hybrid"
                  : "Onsite"}
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {job.seniority.charAt(0).toUpperCase() + job.seniority.slice(1)}
            </span>
            {job.techStack?.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>🕐 {formatDate(job.postedAt ?? job.createdAt)}</span>
            {job.contractLength && (
              <span>📅 {job.contractLength} months</span>
            )}
            {job.city && <span>📍 {job.city}</span>}
          </div>
        </div>
        <div className="ml-4 text-right">
          {job.salaryMax && (
            <div>
              <p className="text-2xl font-bold text-green-600">
                £{job.salaryMax.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">per day</p>
            </div>
          )}
          <Button className="mt-4" asChild>
            <Link href={`/jobs/${job.id}`}>Apply now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
