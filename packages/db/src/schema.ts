import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Enums
export const workLocationTypeEnum = pgEnum("work_location_type", [
  "remote",
  "hybrid",
  "onsite",
]);

export const ir35StatusEnum = pgEnum("ir35_status", ["inside", "outside"]);

export const seniorityEnum = pgEnum("seniority_level", [
  "junior",
  "mid",
  "senior",
  "lead",
]);

export const companies = pgTable("companies", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  scrapeUrl: t.text("scrape_url").notNull(),
  logoUrl: t.text("logo_url"),
  firstPageHash: t.text("first_page_hash"),
}));

export const jobs = pgTable(
  "jobs",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    companyId: t
      .uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    url: t.text().notNull(),
    title: t.varchar({ length: 256 }).notNull(),
    summary: t.text(),
    city: t.varchar({ length: 191 }),
    lat: t.doublePrecision("lat"),
    lng: t.doublePrecision("lng"),
    workLocationType: workLocationTypeEnum("work_location_type").notNull(),
    salaryMin: t.integer("salary_min"),
    salaryMax: t.integer("salary_max"),
    ir35Status: ir35StatusEnum("ir35_status").notNull(),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    postedAt: t.timestamp("posted_at", { withTimezone: true }),
    seniority: seniorityEnum("seniority").notNull(),
    yearsOfExperience: t.integer("years_of_experience"),
    contractLength: t.integer("contract_length"),
    techStack: t.text("tech_stack").array(),
    techStackText: t.text("tech_stack_text"),
  }),
  (table) => ({
    jobsSearchIdx: index("jobs_search_idx").on(
      table.title,
      table.techStackText,
      table.summary,
    ),
  }),
);

export const ignoredJobs = pgTable("ignored_jobs", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  url: t.text().notNull(),
  companyId: t
    .uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  reason: t.text(),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export const profiles = pgTable("profiles", (t) => ({
  id: t.uuid().primaryKey(),
  email: t.text().notNull().unique(),
  isPaid: t.boolean("is_paid").notNull().default(false),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}));

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
  ignoredJobs: many(ignoredJobs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));

export const ignoredJobsRelations = relations(ignoredJobs, ({ one }) => ({
  company: one(companies, {
    fields: [ignoredJobs.companyId],
    references: [companies.id],
  }),
}));

// Zod schemas for inserts
export const insertCompanySchema = createInsertSchema(companies, {
  name: z.string().min(1).max(256),
  scrapeUrl: z.string().url(),
  logoUrl: z.string().url().nullable().optional(),
  firstPageHash: z.string().nullable().optional(),
}).omit({ id: true });

export const insertJobSchema = createInsertSchema(jobs, {
  url: z.string().url(),
  title: z.string().min(1).max(256),
  summary: z.string().max(5000).optional(),
  city: z.string().max(191).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertIgnoredJobSchema = createInsertSchema(ignoredJobs, {
  url: z.string().url(),
  reason: z.string().max(1024).optional(),
}).omit({ id: true, createdAt: true });

export const insertProfileSchema = createInsertSchema(profiles, {
  email: z.string().email(),
}).omit({
  id: true,
  createdAt: true,
  isPaid: true,
});

export * from "./auth-schema";

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type IgnoredJob = typeof ignoredJobs.$inferSelect;
export type NewIgnoredJob = typeof ignoredJobs.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
