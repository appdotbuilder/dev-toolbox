
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { toolUsageTable } from '../db/schema';
import { getToolUsageHistory } from '../handlers/get_tool_usage_history';

describe('getToolUsageHistory', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no tool usage records exist', async () => {
    const result = await getToolUsageHistory();

    expect(result).toEqual([]);
  });

  it('should return all tool usage records', async () => {
    // Insert test records
    await db.insert(toolUsageTable).values([
      {
        tool_type: 'json_parser',
        input_data: '{"test": "data"}',
        output_data: '{"is_valid": true}'
      },
      {
        tool_type: 'base64_encoder',
        input_data: 'hello world',
        output_data: '{"result": "aGVsbG8gd29ybGQ="}'
      },
      {
        tool_type: 'base64_decoder',
        input_data: 'aGVsbG8gd29ybGQ=',
        output_data: '{"result": "hello world"}'
      }
    ]).execute();

    const result = await getToolUsageHistory();

    expect(result).toHaveLength(3);
    
    // Verify record structure
    result.forEach(record => {
      expect(record.id).toBeDefined();
      expect(record.tool_type).toMatch(/json_parser|base64_encoder|base64_decoder/);
      expect(record.input_data).toBeDefined();
      expect(record.output_data).toBeDefined();
      expect(record.created_at).toBeInstanceOf(Date);
    });
  });

  it('should return records ordered by most recent first', async () => {
    // Insert records with slight delays to ensure different timestamps
    await db.insert(toolUsageTable).values({
      tool_type: 'json_parser',
      input_data: 'first record',
      output_data: '{"is_valid": true}'
    }).execute();

    // Small delay to ensure different created_at timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(toolUsageTable).values({
      tool_type: 'base64_encoder',
      input_data: 'second record',
      output_data: '{"result": "c2Vjb25kIHJlY29yZA=="}'
    }).execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(toolUsageTable).values({
      tool_type: 'base64_decoder',
      input_data: 'third record',
      output_data: '{"result": "third record"}'
    }).execute();

    const result = await getToolUsageHistory();

    expect(result).toHaveLength(3);
    
    // Verify ordering - most recent first
    expect(result[0].input_data).toEqual('third record');
    expect(result[1].input_data).toEqual('second record');
    expect(result[2].input_data).toEqual('first record');

    // Verify timestamps are in descending order
    expect(result[0].created_at >= result[1].created_at).toBe(true);
    expect(result[1].created_at >= result[2].created_at).toBe(true);
  });

  it('should handle different tool types correctly', async () => {
    // Insert one record of each tool type
    await db.insert(toolUsageTable).values([
      {
        tool_type: 'json_parser',
        input_data: '{"valid": true}',
        output_data: '{"is_valid": true, "pretty_json": "{\\"valid\\": true}"}'
      },
      {
        tool_type: 'base64_encoder',
        input_data: 'test string',
        output_data: '{"result": "dGVzdCBzdHJpbmc="}'
      },
      {
        tool_type: 'base64_decoder',
        input_data: 'dGVzdCBzdHJpbmc=',
        output_data: '{"result": "test string"}'
      }
    ]).execute();

    const result = await getToolUsageHistory();

    expect(result).toHaveLength(3);

    // Check that all tool types are represented
    const toolTypes = result.map(r => r.tool_type);
    expect(toolTypes).toContain('json_parser');
    expect(toolTypes).toContain('base64_encoder');
    expect(toolTypes).toContain('base64_decoder');
  });
});
