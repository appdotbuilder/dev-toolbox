import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import type { Base64Output } from '../../../server/src/schema';

export function Base64Tool() {
  // Encode state
  const [textToEncode, setTextToEncode] = useState<string>('');
  const [encodeResult, setEncodeResult] = useState<Base64Output | null>(null);
  const [isEncoding, setIsEncoding] = useState<boolean>(false);

  // Decode state
  const [base64ToDecode, setBase64ToDecode] = useState<string>('');
  const [decodeResult, setDecodeResult] = useState<Base64Output | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  const handleEncode = async () => {
    if (!textToEncode.trim()) {
      setEncodeResult({
        result: null,
        error_message: 'Please enter some text to encode'
      });
      return;
    }

    setIsEncoding(true);
    try {
      const response = await trpc.encodeBase64.mutate({
        text: textToEncode
      });
      setEncodeResult(response);

      // Save to usage history
      await trpc.createToolUsage.mutate({
        tool_type: 'base64_encoder',
        input_data: textToEncode,
        output_data: JSON.stringify(response)
      });
    } catch (error) {
      setEncodeResult({
        result: null,
        error_message: 'Failed to encode: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!base64ToDecode.trim()) {
      setDecodeResult({
        result: null,
        error_message: 'Please enter some Base64 text to decode'
      });
      return;
    }

    setIsDecoding(true);
    try {
      const response = await trpc.decodeBase64.mutate({
        base64_text: base64ToDecode
      });
      setDecodeResult(response);

      // Save to usage history
      await trpc.createToolUsage.mutate({
        tool_type: 'base64_decoder',
        input_data: base64ToDecode,
        output_data: JSON.stringify(response)
      });
    } catch (error) {
      setDecodeResult({
        result: null,
        error_message: 'Failed to decode: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const clearEncode = () => {
    setTextToEncode('');
    setEncodeResult(null);
  };

  const clearDecode = () => {
    setBase64ToDecode('');
    setDecodeResult(null);
  };

  const loadEncodeExample = () => {
    setTextToEncode('Hello, World! This is a sample text for Base64 encoding. 🚀');
  };

  const loadDecodeExample = () => {
    setBase64ToDecode('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4g8J+agA==');
  };

  return (
    <Tabs defaultValue="encode" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="encode">🔒 Encode to Base64</TabsTrigger>
        <TabsTrigger value="decode">🔓 Decode from Base64</TabsTrigger>
      </TabsList>

      <TabsContent value="encode" className="space-y-6 mt-6">
        {/* Encode Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Text to Encode</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadEncodeExample}
                className="text-xs"
              >
                📄 Load Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearEncode}
                className="text-xs"
              >
                🗑️ Clear
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Enter text to encode to Base64...
Example: Hello, World!"
            value={textToEncode}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextToEncode(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
            rows={6}
          />
          <Button 
            onClick={handleEncode} 
            disabled={isEncoding}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isEncoding ? '⏳ Encoding...' : '🔒 Encode to Base64'}
          </Button>
        </div>

        {/* Encode Results */}
        {encodeResult && (
          <Card className={`border-2 ${encodeResult.result ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {encodeResult.result ? (
                  <>
                    ✅ Successfully Encoded
                    <Badge className="bg-green-600">Success</Badge>
                  </>
                ) : (
                  <>
                    ❌ Encoding Failed
                    <Badge variant="destructive">Error</Badge>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {encodeResult.result ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-green-800 dark:text-green-200">Base64 Result:</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(encodeResult.result!)}
                      className="text-xs"
                    >
                      📋 Copy
                    </Button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                      {encodeResult.result}
                    </pre>
                  </div>
                </div>
              ) : (
                <Alert className="border-red-200 dark:border-red-800">
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    <strong>Encoding Error:</strong> {encodeResult.error_message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="decode" className="space-y-6 mt-6">
        {/* Decode Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Base64 to Decode</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDecodeExample}
                className="text-xs"
              >
                📄 Load Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearDecode}
                className="text-xs"
              >
                🗑️ Clear
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Enter Base64 text to decode...
Example: SGVsbG8sIFdvcmxkIQ=="
            value={base64ToDecode}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBase64ToDecode(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
            rows={6}
          />
          <Button 
            onClick={handleDecode} 
            disabled={isDecoding}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isDecoding ? '⏳ Decoding...' : '🔓 Decode from Base64'}
          </Button>
        </div>

        {/* Decode Results */}
        {decodeResult && (
          <Card className={`border-2 ${decodeResult.result ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {decodeResult.result ? (
                  <>
                    ✅ Successfully Decoded
                    <Badge className="bg-green-600">Success</Badge>
                  </>
                ) : (
                  <>
                    ❌ Decoding Failed
                    <Badge variant="destructive">Error</Badge>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {decodeResult.result ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-green-800 dark:text-green-200">Decoded Text:</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(decodeResult.result!)}
                      className="text-xs"
                    >
                      📋 Copy
                    </Button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {decodeResult.result}
                    </pre>
                  </div>
                </div>
              ) : (
                <Alert className="border-red-200 dark:border-red-800">
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    <strong>Decoding Error:</strong> {decodeResult.error_message}
                  </AlertDescription>
                </Alert>
                )}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}