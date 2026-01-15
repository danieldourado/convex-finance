import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  financialRecords: defineTable({
    year: v.number(),
    age: v.number(),
    netWorth: v.number(),
    growthPercentage: v.optional(v.number()),
    growthAmount: v.optional(v.number()),
  }).index("by_year", ["year"]),

  userSettings: defineTable({
    projectionYears: v.number(),
    customGrowthPercentage: v.optional(v.number()),
    annualContribution: v.optional(v.number()), // Fixed annual contribution amount
  }),
});
