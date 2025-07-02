
import { serial, text, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core';

// Define enum for tool types
export const toolTypeEnum = pgEnum('tool_type', ['json_parser', 'base64_encoder', 'base64_decoder']);

export const toolUsageTable = pgTable('tool_usage', {
  id: serial('id').primaryKey(),
  tool_type: toolTypeEnum('tool_type').notNull(),
  input_data: text('input_data').notNull(),
  output_data: text('output_data').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type ToolUsage = typeof toolUsageTable.$inferSelect;
export type NewToolUsage = typeof toolUsageTable.$inferInsert;

// Export all tables for proper query building
export const tables = { toolUsage: toolUsageTable };
