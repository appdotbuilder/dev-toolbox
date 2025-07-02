
import { type JsonParserInput, type JsonParserOutput } from '../schema';

export const parseJson = async (input: JsonParserInput): Promise<JsonParserOutput> => {
  try {
    // Attempt to parse the JSON string
    const parsed = JSON.parse(input.json_text);
    
    // If parsing succeeds, create pretty-printed version
    const prettyJson = JSON.stringify(parsed, null, 2);
    
    return {
      is_valid: true,
      pretty_json: prettyJson,
      error_message: null
    };
  } catch (error) {
    // If parsing fails, return error details
    return {
      is_valid: false,
      pretty_json: null,
      error_message: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
};
