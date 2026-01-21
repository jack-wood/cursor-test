import { db } from "./client";
import { companies, jobs } from "./schema";

// Simple example seed script. Extend this with real seed data as needed.
async function main() {
  // Example: insert a company and a job
  const [company] = await db
    .insert(companies)
    .values({ name: "Example Ltd", scrapeUrl: "https://example.com/jobs" })
    .returning();

  await db.insert(jobs).values({
    companyId: company.id,
    url: "https://example.com/jobs/123",
    title: "Senior TypeScript Contractor",
    summary: "Example job posting for a senior TypeScript engineer.",
    city: "Remote",
    workLocationType: "remote",
    ir35Status: "outside",
    seniority: "senior",
  });
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
