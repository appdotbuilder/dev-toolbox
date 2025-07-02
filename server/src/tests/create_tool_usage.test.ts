
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { toolUsageTable } from '../db/schema';
import { type CreateToolUsageInput } from '../schema';
import { createToolUsage } from '../handlers/create_tool_usage';
import { eq } from 'drizzle-orm';

// Test input for JSON parser
const jsonParserInput: CreateToolUsageInput = {
  tool_type: 'json_parser',
  input_data: '{"test": "data"}',
  output_data: '{"is_valid": true, "pretty_json": "{\n  \"test\": \"data\"\n}", "error_message": null}'
};

// Test input for Base64 encoder
const base64EncodeInput: CreateToolUsageInput = {
  tool_type: 'base64_encoder',
  input_data: 'hello world',
  output_data: '{"result": "aGVsbG8gd29ybGQ=", "error_message": null}'
};

// Test input for Base64 decoder
const base64DecodeInput: CreateToolUsageInput = {
  tool_type: 'base64_decoder',
  input_data: 'aGVsbG8gd29ybGQ=',
  output_data: '{"result": "hello world", "error_message": null}'
};

describe('createToolUsage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a JSON parser tool usage record', async () => {
    const result = await createToolUsage(jsonParserInput);

    // Basic field validation
    expect(result.tool_type).toEqual('json_parser');
    expect(result.input_data).toEqual('{"test": "data"}');
    expect(result.output_data).toEqual(jsonParserInput.output_data);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a Base64 encoder tool usage record', async () => {
    const result = await createToolUsage(base64EncodeInput);

    // Basic field validation
    expect(result.tool_type).toEqual('base64_encoder');
    expect(result.input_data).toEqual('hello world');
    expect(result.output_data).toEqual(base64EncodeInput.output_data);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a Base64 decoder tool usage record', async () => {
    const result = await createToolUsage(base64DecodeInput);

    // Basic field validation
    expect(result.tool_type).toEqual('base64_decoder');
    expect(result.input_data).toEqual('aGVsbG8gd29ybGQ=');
    expect(result.output_data).toEqual(base64DecodeInput.output_data);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save tool usage record to database', async () => {
    const result = await createToolUsage(jsonParserInput);

    // Query using proper drizzle syntax
    const toolUsages = await db.select()
      .from(toolUsageTable)
      .where(eq(toolUsageTable.id, result.id))
      .execute();

    expect(toolUsages).toHaveLength(1);
    expect(toolUsages[0].tool_type).toEqual('json_parser');
    expect(toolUsages[0].input_data).toEqual('{"test": "data"}');
    expect(toolUsages[0].output_data).toEqual(jsonParserInput.output_data);
    expect(toolUsages[0].created_at).toBeInstanceOf(Date);
  });

  it('should auto-generate timestamp for created_at', async () => {
    const beforeCreate = new Date();
    const result = await createToolUsage(jsonParserInput);
    const afterCreate = new Date();

    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });
});
