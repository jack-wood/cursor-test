import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";
import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";

import { companies, jobs, ignoredJobs } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

const jobFiltersSchema = z.object({
  keywords: z.string().optional(),
  city: z.string().optional(),
  distance: z.string().optional(), // Will be handled client-side for now
  ir35Status: z.enum(["inside", "outside"]).optional(),
  workLocationType: z.enum(["remote", "hybrid", "onsite"]).optional(),
  seniority: z.enum(["junior", "mid", "senior", "lead"]).optional(),
  dayRateMin: z.number().optional(),
  dayRateMax: z.number().optional(),
  datePosted: z.enum(["today", "week", "month"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["date", "salary"]).default("date"),
});

export const jobRouter = {
  /**
   * Search and filter jobs
   */
  search: publicProcedure
    .input(jobFiltersSchema)
    .query(async ({ ctx, input }) => {
      const conditions = [];

      // Keyword search using full-text search on title, techStackText, and summary
      if (input.keywords) {
        conditions.push(
          sql`to_tsvector('english', ${jobs.title} || ' ' || COALESCE(${jobs.techStackText}, '') || ' ' || COALESCE(${jobs.summary}, '')) @@ plainto_tsquery('english', ${input.keywords})`,
        );
      }

      // City filter
      if (input.city && input.city !== "Any") {
        conditions.push(ilike(jobs.city, `%${input.city}%`));
      }

      // IR35 status
      if (input.ir35Status) {
        conditions.push(eq(jobs.ir35Status, input.ir35Status));
      }

      // Work location type
      if (input.workLocationType) {
        conditions.push(eq(jobs.workLocationType, input.workLocationType));
      }

      // Seniority
      if (input.seniority) {
        conditions.push(eq(jobs.seniority, input.seniority));
      }

      // Day rate range
      if (input.dayRateMin !== undefined) {
        conditions.push(gte(jobs.salaryMin, input.dayRateMin));
      }
      if (input.dayRateMax !== undefined) {
        conditions.push(lte(jobs.salaryMax, input.dayRateMax));
      }

      // Date posted filter
      if (input.datePosted) {
        const now = new Date();
        let dateThreshold: Date;
        if (input.datePosted === "today") {
          dateThreshold = new Date(now.setHours(0, 0, 0, 0));
        } else if (input.datePosted === "week") {
          dateThreshold = new Date(now.setDate(now.getDate() - 7));
        } else {
          dateThreshold = new Date(now.setMonth(now.getMonth() - 1));
        }
        conditions.push(gte(jobs.postedAt ?? jobs.createdAt, dateThreshold));
      }

      // Exclude ignored jobs if user is logged in
      // Note: This would require a more complex query with NOT IN subquery
      // For now, we'll handle ignored jobs filtering in a future iteration

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const [countResult] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(jobs)
        .where(whereClause);

      const total = Number(countResult?.count ?? 0);

      // Get jobs with company info
      const results = await ctx.db.query.jobs.findMany({
        where: whereClause,
        with: {
          company: true,
        },
        orderBy: (jobs, { desc }) =>
          input.sortBy === "salary"
            ? [desc(jobs.salaryMax)]
            : [desc(jobs.postedAt ?? jobs.createdAt)],
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      });

      return {
        jobs: results,
        total,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  /**
   * Get a single job by ID
   */
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.jobs.findFirst({
        where: eq(jobs.id, input.id),
        with: {
          company: true,
        },
      });
    }),

  /**
   * Get companies (for admin/scraping)
   */
  companies: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.companies.findMany({
      orderBy: (companies, { desc }) => [desc(companies.id)],
    });
  }),

  /**
   * Create a company (for scraping pipeline)
   */
  createCompany: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        scrapeUrl: z.string().url(),
        logoUrl: z.string().url().optional(),
        firstPageHash: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [company] = await ctx.db
        .insert(companies)
        .values(input)
        .returning();
      return company;
    }),

  /**
   * Create a job (for scraping pipeline)
   */
  createJob: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        url: z.string().url(),
        title: z.string().min(1).max(256),
        summary: z.string().optional(),
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        workLocationType: z.enum(["remote", "hybrid", "onsite"]),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        ir35Status: z.enum(["inside", "outside"]),
        postedAt: z.date().optional(),
        seniority: z.enum(["junior", "mid", "senior", "lead"]),
        yearsOfExperience: z.number().optional(),
        contractLength: z.number().optional(),
        techStack: z.array(z.string()).optional(),
        techStackText: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [job] = await ctx.db.insert(jobs).values(input).returning();
      return job;
    }),
} satisfies TRPCRouterRecord;
