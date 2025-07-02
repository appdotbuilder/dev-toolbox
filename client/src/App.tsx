
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonParserTool } from '@/components/JsonParserTool';
import { Base64Tool } from '@/components/Base64Tool';
import { Badge } from '@/components/ui/badge';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🛠️ Developer Toolbox
          </h1>
          <p className="text-slate-600 text-lg">
            Essential tools for developers - JSON validation, Base64 encoding/decoding, and more
          </p>
        </div>

        {/* Tool Tabs */}
        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="json" className="text-base py-3">
              📝 JSON Parser
            </TabsTrigger>
            <TabsTrigger value="base64" className="text-base py-3">
              🔒 Base64 Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  📝 JSON Parser & Validator
                  <Badge variant="secondary">Pretty Print</Badge>
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Validate, format, and beautify your JSON data with syntax highlighting
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <JsonParserTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="base64">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-green-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  🔒 Base64 Encoder/Decoder
                  <Badge variant="secondary">Encode & Decode</Badge>
                </CardTitle>
                <CardDescription className="text-green-600">
                  Convert text to Base64 encoding and decode Base64 back to readable text
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Base64Tool />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500">
          <p>Built with ❤️ for developers • Made with React & tRPC</p>
        </div>
      </div>
    </div>
  );
}

export default App;
