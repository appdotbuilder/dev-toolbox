
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type Base64EncodeInput } from '../schema';
import { encodeBase64 } from '../handlers/encode_base64';

describe('encodeBase64', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should encode simple text to Base64', async () => {
    const input: Base64EncodeInput = {
      text: 'Hello World'
    };

    const result = await encodeBase64(input);

    expect(result.result).toEqual('SGVsbG8gV29ybGQ=');
    expect(result.error_message).toBeNull();
  });

  it('should encode empty string to Base64', async () => {
    const input: Base64EncodeInput = {
      text: ''
    };

    const result = await encodeBase64(input);

    expect(result.result).toEqual('');
    expect(result.error_message).toBeNull();
  });

  it('should encode text with special characters', async () => {
    const input: Base64EncodeInput = {
      text: 'Hello, 世界! 🌍'
    };

    const result = await encodeBase64(input);

    // Verify the encoding is correct by decoding it back
    const decoded = Buffer.from(result.result!, 'base64').toString('utf8');
    expect(decoded).toEqual('Hello, 世界! 🌍');
    expect(result.error_message).toBeNull();
  });

  it('should encode multiline text', async () => {
    const input: Base64EncodeInput = {
      text: 'Line 1\nLine 2\nLine 3'
    };

    const result = await encodeBase64(input);

    // Verify the encoding preserves newlines
    const decoded = Buffer.from(result.result!, 'base64').toString('utf8');
    expect(decoded).toEqual('Line 1\nLine 2\nLine 3');
    expect(result.error_message).toBeNull();
  });

  it('should encode JSON text', async () => {
    const input: Base64EncodeInput = {
      text: '{"name": "test", "value": 123}'
    };

    const result = await encodeBase64(input);

    // Verify the JSON structure is preserved
    const decoded = Buffer.from(result.result!, 'base64').toString('utf8');
    expect(decoded).toEqual('{"name": "test", "value": 123}');
    expect(result.error_message).toBeNull();
  });

  it('should encode long text', async () => {
    const longText = 'A'.repeat(1000);
    const input: Base64EncodeInput = {
      text: longText
    };

    const result = await encodeBase64(input);

    // Verify the long text is encoded correctly
    const decoded = Buffer.from(result.result!, 'base64').toString('utf8');
    expect(decoded).toEqual(longText);
    expect(result.error_message).toBeNull();
  });
});
