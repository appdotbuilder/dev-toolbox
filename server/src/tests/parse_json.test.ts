
import { describe, expect, it } from 'bun:test';
import { parseJson } from '../handlers/parse_json';
import { type JsonParserInput } from '../schema';

describe('parseJson', () => {
  it('should parse valid JSON and return pretty-printed format', async () => {
    const input: JsonParserInput = {
      json_text: '{"name":"John","age":30,"city":"New York"}'
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(true);
    expect(result.pretty_json).toBe(`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`);
    expect(result.error_message).toBeNull();
  });

  it('should handle valid nested JSON objects', async () => {
    const input: JsonParserInput = {
      json_text: '{"user":{"name":"Alice","settings":{"theme":"dark","notifications":true}}}'
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(true);
    expect(result.pretty_json).toBe(`{
  "user": {
    "name": "Alice",
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  }
}`);
    expect(result.error_message).toBeNull();
  });

  it('should handle valid JSON arrays', async () => {
    const input: JsonParserInput = {
      json_text: '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]'
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(true);
    expect(result.pretty_json).toBe(`[
  {
    "id": 1,
    "name": "Item 1"
  },
  {
    "id": 2,
    "name": "Item 2"
  }
]`);
    expect(result.error_message).toBeNull();
  });

  it('should handle simple valid JSON values', async () => {
    const input: JsonParserInput = {
      json_text: '"hello world"'
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(true);
    expect(result.pretty_json).toBe('"hello world"');
    expect(result.error_message).toBeNull();
  });

  it('should return error for invalid JSON syntax', async () => {
    const input: JsonParserInput = {
      json_text: '{"name": "John", "age": 30,}' // trailing comma
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(false);
    expect(result.pretty_json).toBeNull();
    expect(result.error_message).toBeDefined();
    expect(typeof result.error_message).toBe('string');
  });

  it('should return error for malformed JSON', async () => {
    const input: JsonParserInput = {
      json_text: '{name: "John"}' // unquoted key
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(false);
    expect(result.pretty_json).toBeNull();
    expect(result.error_message).toBeDefined();
    expect(typeof result.error_message).toBe('string');
  });

  it('should return error for empty string', async () => {
    const input: JsonParserInput = {
      json_text: ''
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(false);
    expect(result.pretty_json).toBeNull();
    expect(result.error_message).toBeDefined();
    expect(typeof result.error_message).toBe('string');
  });

  it('should return error for unclosed JSON object', async () => {
    const input: JsonParserInput = {
      json_text: '{"name": "John", "age": 30'
    };

    const result = await parseJson(input);

    expect(result.is_valid).toBe(false);
    expect(result.pretty_json).toBeNull();
    expect(result.error_message).toBeDefined();
    expect(typeof result.error_message).toBe('string');
  });
});
