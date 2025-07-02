
import { db } from '../db';
import { toolUsageTable } from '../db/schema';
import { type ToolUsage } from '../schema';
import { desc } from 'drizzle-orm';

export async function getToolUsageHistory(): Promise<ToolUsage[]> {
  try {
    // Fetch all tool usage records ordered by most recent first
    const results = await db.select()
      .from(toolUsageTable)
      .orderBy(desc(toolUsageTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch tool usage history:', error);
    throw error;
  }
}
