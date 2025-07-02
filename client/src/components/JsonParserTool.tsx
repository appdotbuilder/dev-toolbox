import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import type { JsonParserOutput } from '../../../server/src/schema';

export function JsonParserTool() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [result, setResult] = useState<JsonParserOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParseJson = async () => {
    if (!jsonInput.trim()) {
      setResult({
        is_valid: false,
        pretty_json: null,
        error_message: 'Please enter some JSON text to validate'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await trpc.parseJson.mutate({
        json_text: jsonInput
      });
      setResult(response);

      // Save to usage history
      await trpc.createToolUsage.mutate({
        tool_type: 'json_parser',
        input_data: jsonInput,
        output_data: JSON.stringify(response)
      });
    } catch (error) {
      setResult({
        is_valid: false,
        pretty_json: null,
        error_message: 'Failed to parse JSON: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setResult(null);
  };

  const handleLoadExample = () => {
    const exampleJson = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "isActive": true
}`;
    setJsonInput(exampleJson);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">JSON Input</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadExample}
              className="text-xs"
            >
              📄 Load Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs"
            >
              🗑️ Clear
            </Button>
          </div>
        </div>
        <Textarea
          placeholder="Enter your JSON here... 
Example: {&quot;name&quot;: &quot;John&quot;, &quot;age&quot;: 30}"
          value={jsonInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
          rows={8}
        />
        <Button 
          onClick={handleParseJson} 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? '⏳ Parsing...' : '✨ Parse & Validate JSON'}
        </Button>
      </div>

      {/* Results Section */}
      {result && (
        <Card className={`border-2 ${result.is_valid ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {result.is_valid ? (
                <>
                  ✅ Valid JSON
                  <Badge className="bg-green-600">Success</Badge>
                </>
              ) : (
                <>
                  ❌ Invalid JSON
                  <Badge variant="destructive">Error</Badge>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.is_valid && result.pretty_json ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-green-800 dark:text-green-200">Pretty-printed JSON:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.pretty_json!)}
                    className="text-xs"
                  >
                    📋 Copy
                  </Button>
                </div>
                <div className="bg-white dark:bg-slate-800 border rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {result.pretty_json}
                  </pre>
                </div>
              </div>
            ) : (
              <Alert className="border-red-200 dark:border-red-800">
                <AlertDescription className="text-red-700 dark:text-red-300">
                  <strong>Parse Error:</strong> {result.error_message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}