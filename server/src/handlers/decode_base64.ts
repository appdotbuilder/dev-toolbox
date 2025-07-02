
import { type Base64DecodeInput, type Base64Output } from '../schema';

export async function decodeBase64(input: Base64DecodeInput): Promise<Base64Output> {
    try {
        // Validate that the input is a valid Base64 string
        // Base64 should only contain A-Z, a-z, 0-9, +, /, and = for padding
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        
        if (!base64Regex.test(input.base64_text)) {
            return {
                result: null,
                error_message: 'Invalid Base64 format: contains invalid characters'
            };
        }
        
        // Check if the length is valid (should be multiple of 4)
        if (input.base64_text.length % 4 !== 0) {
            return {
                result: null,
                error_message: 'Invalid Base64 format: length must be multiple of 4'
            };
        }
        
        // Attempt to decode the Base64 string
        const decoded = Buffer.from(input.base64_text, 'base64').toString('utf8');
        
        // Verify the decode was successful by re-encoding and comparing
        const reencoded = Buffer.from(decoded, 'utf8').toString('base64');
        if (reencoded !== input.base64_text) {
            return {
                result: null,
                error_message: 'Invalid Base64 format: failed verification'
            };
        }
        
        return {
            result: decoded,
            error_message: null
        };
    } catch (error) {
        return {
            result: null,
            error_message: error instanceof Error ? error.message : 'Decoding failed'
        };
    }
}
