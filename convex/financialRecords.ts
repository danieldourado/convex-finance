import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("financialRecords")
      .withIndex("by_year")
      .order("asc")
      .collect();
  },
});

export const add = mutation({
  args: {
    year: v.number(),
    age: v.number(),
    netWorth: v.number(),
    growthPercentage: v.optional(v.number()),
    growthAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if record for this year already exists
    const existing = await ctx.db
      .query("financialRecords")
      .withIndex("by_year", (q) => q.eq("year", args.year))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        age: args.age,
        netWorth: args.netWorth,
        growthPercentage: args.growthPercentage,
        growthAmount: args.growthAmount,
      });
      return existing._id;
    }

    // Create new record
    return await ctx.db.insert("financialRecords", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("financialRecords"),
    year: v.number(),
    age: v.number(),
    netWorth: v.number(),
    growthPercentage: v.optional(v.number()),
    growthAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("financialRecords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("financialRecords").first();
    if (existing) {
      return { message: "Data already seeded" };
    }

    const initialData = [
      { year: 2017, age: 27, netWorth: 111000 },
      { year: 2018, age: 28, netWorth: 135000, growthPercentage: 22, growthAmount: 24000 },
      { year: 2019, age: 29, netWorth: 170225, growthPercentage: 26, growthAmount: 35225 },
      { year: 2020, age: 30, netWorth: 200000, growthPercentage: 17, growthAmount: 29775 },
      { year: 2021, age: 31, netWorth: 497000, growthPercentage: 149, growthAmount: 297000 },
      { year: 2022, age: 32, netWorth: 740000, growthPercentage: 49, growthAmount: 243000 },
      { year: 2023, age: 33, netWorth: 1220000, growthPercentage: 65, growthAmount: 480000 },
      { year: 2024, age: 34, netWorth: 1987000, growthPercentage: 63, growthAmount: 767000 },
      { year: 2025, age: 35, netWorth: 2774000, growthPercentage: 40, growthAmount: 787000 },
      { year: 2026, age: 36, netWorth: 3606200, growthPercentage: 30, growthAmount: 832200 },
    ];

    for (const record of initialData) {
      await ctx.db.insert("financialRecords", record);
    }

    return { message: "Data seeded successfully" };
  },
});
