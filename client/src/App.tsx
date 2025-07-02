import { createContext, useContext, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonParserTool } from '@/components/JsonParserTool';
import { Base64Tool } from '@/components/Base64Tool';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('developer-toolbox-theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem('developer-toolbox-theme', theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 transition-colors">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                🛠️ Developer Toolbox
              </h1>
              <p className="text-muted-foreground text-lg">
                Essential tools for developers - JSON validation, Base64 encoding/decoding, and more
              </p>
            </div>
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
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
              <Card className="shadow-lg border">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/20 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    📝 JSON Parser & Validator
                    <Badge variant="secondary">Pretty Print</Badge>
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-300">
                    Validate, format, and beautify your JSON data with syntax highlighting
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <JsonParserTool />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="base64">
              <Card className="shadow-lg border">
                <CardHeader className="bg-green-50 dark:bg-green-950/20 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    🔒 Base64 Encoder/Decoder
                    <Badge variant="secondary">Encode & Decode</Badge>
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-300">
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
          <div className="text-center mt-12 text-muted-foreground">
            <p>Built with ❤️ for developers • Made with React & tRPC</p>
          </div>
        </div>
      </div>
    </ThemeProviderContext.Provider>
  );
}

export default App;