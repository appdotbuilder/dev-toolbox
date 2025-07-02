
import { type Base64EncodeInput, type Base64Output } from '../schema';

export async function encodeBase64(input: Base64EncodeInput): Promise<Base64Output> {
  try {
    // Encode the input text to Base64 using Buffer
    const encoded = Buffer.from(input.text, 'utf8').toString('base64');
    
    return {
      result: encoded,
      error_message: null
    };
  } catch (error) {
    console.error('Base64 encoding failed:', error);
    return {
      result: null,
      error_message: error instanceof Error ? error.message : 'Base64 encoding failed'
    };
  }
}
