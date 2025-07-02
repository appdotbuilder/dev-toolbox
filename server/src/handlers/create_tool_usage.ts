
import { db } from '../db';
import { toolUsageTable } from '../db/schema';
import { type CreateToolUsageInput, type ToolUsage } from '../schema';

export const createToolUsage = async (input: CreateToolUsageInput): Promise<ToolUsage> => {
  try {
    // Insert tool usage record
    const result = await db.insert(toolUsageTable)
      .values({
        tool_type: input.tool_type,
        input_data: input.input_data,
        output_data: input.output_data
      })
      .returning()
      .execute();

    // Return the created record
    return result[0];
  } catch (error) {
    console.error('Tool usage creation failed:', error);
    throw error;
  }
};
