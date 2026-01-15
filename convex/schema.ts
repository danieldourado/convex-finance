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
});
