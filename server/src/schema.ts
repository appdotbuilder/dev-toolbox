
import { z } from 'zod';

// Tool usage history schema
export const toolUsageSchema = z.object({
  id: z.number(),
  tool_type: z.enum(['json_parser', 'base64_encoder', 'base64_decoder']),
  input_data: z.string(),
  output_data: z.string(),
  created_at: z.coerce.date()
});

export type ToolUsage = z.infer<typeof toolUsageSchema>;

// Input schema for JSON parser
export const jsonParserInputSchema = z.object({
  json_text: z.string()
});

export type JsonParserInput = z.infer<typeof jsonParserInputSchema>;

// Output schema for JSON parser
export const jsonParserOutputSchema = z.object({
  is_valid: z.boolean(),
  pretty_json: z.string().nullable(),
  error_message: z.string().nullable()
});

export type JsonParserOutput = z.infer<typeof jsonParserOutputSchema>;

// Input schema for Base64 encoder
export const base64EncodeInputSchema = z.object({
  text: z.string()
});

export type Base64EncodeInput = z.infer<typeof base64EncodeInputSchema>;

// Input schema for Base64 decoder
export const base64DecodeInputSchema = z.object({
  base64_text: z.string()
});

export type Base64DecodeInput = z.infer<typeof base64DecodeInputSchema>;

// Output schema for Base64 operations
export const base64OutputSchema = z.object({
  result: z.string().nullable(),
  error_message: z.string().nullable()
});

export type Base64Output = z.infer<typeof base64OutputSchema>;

// Input schema for creating tool usage record
export const createToolUsageInputSchema = z.object({
  tool_type: z.enum(['json_parser', 'base64_encoder', 'base64_decoder']),
  input_data: z.string(),
  output_data: z.string()
});

export type CreateToolUsageInput = z.infer<typeof createToolUsageInputSchema>;
