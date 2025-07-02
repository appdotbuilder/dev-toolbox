
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type Base64DecodeInput } from '../schema';
import { decodeBase64 } from '../handlers/decode_base64';

describe('decodeBase64', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should decode valid Base64 string', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'SGVsbG8gV29ybGQ=' // "Hello World" in Base64
    };

    const result = await decodeBase64(input);

    expect(result.result).toEqual('Hello World');
    expect(result.error_message).toBeNull();
  });

  it('should decode empty string', async () => {
    const input: Base64DecodeInput = {
      base64_text: '' // Empty string is valid Base64
    };

    const result = await decodeBase64(input);

    expect(result.result).toEqual('');
    expect(result.error_message).toBeNull();
  });

  it('should decode Base64 with padding', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'VGVzdA==' // "Test" in Base64 with padding
    };

    const result = await decodeBase64(input);

    expect(result.result).toEqual('Test');
    expect(result.error_message).toBeNull();
  });

  it('should decode complex text with special characters', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'VGhpcyBpcyBhIHRlc3Qgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnM6ICEjJCVeJiooKQ==' // Complex text
    };

    const result = await decodeBase64(input);

    expect(result.result).toEqual('This is a test with special characters: !#$%^&*()');
    expect(result.error_message).toBeNull();
  });

  it('should handle invalid Base64 with wrong characters', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'Invalid@Base64!' // Contains invalid characters
    };

    const result = await decodeBase64(input);

    expect(result.result).toBeNull();
    expect(result.error_message).toEqual('Invalid Base64 format: contains invalid characters');
  });

  it('should handle invalid Base64 with wrong length', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'SGVsbG8' // Length is not multiple of 4
    };

    const result = await decodeBase64(input);

    expect(result.result).toBeNull();
    expect(result.error_message).toEqual('Invalid Base64 format: length must be multiple of 4');
  });

  it('should handle malformed Base64 that passes regex but fails verification', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'AAAA' // Valid format but may not decode/re-encode consistently
    };

    const result = await decodeBase64(input);

    // This should either succeed or fail with verification error
    if (result.result === null) {
      expect(result.error_message).toContain('Invalid Base64 format');
    } else {
      expect(typeof result.result).toBe('string');
      expect(result.error_message).toBeNull();
    }
  });

  it('should decode numbers and symbols correctly', async () => {
    const input: Base64DecodeInput = {
      base64_text: 'MTIzNDU2Nzg5MA==' // "1234567890" in Base64
    };

    const result = await decodeBase64(input);

    expect(result.result).toEqual('1234567890');
    expect(result.error_message).toBeNull();
  });
});
