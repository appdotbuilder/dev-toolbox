
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  jsonParserInputSchema, 
  base64EncodeInputSchema, 
  base64DecodeInputSchema, 
  createToolUsageInputSchema 
} from './schema';
import { parseJson } from './handlers/parse_json';
import { encodeBase64 } from './handlers/encode_base64';
import { decodeBase64 } from './handlers/decode_base64';
import { createToolUsage } from './handlers/create_tool_usage';
import { getToolUsageHistory } from './handlers/get_tool_usage_history';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // JSON Parser tool
  parseJson: publicProcedure
    .input(jsonParserInputSchema)
    .mutation(({ input }) => parseJson(input)),
  
  // Base64 Encoder tool
  encodeBase64: publicProcedure
    .input(base64EncodeInputSchema)
    .mutation(({ input }) => encodeBase64(input)),
  
  // Base64 Decoder tool
  decodeBase64: publicProcedure
    .input(base64DecodeInputSchema)
    .mutation(({ input }) => decodeBase64(input)),
  
  // Tool usage tracking
  createToolUsage: publicProcedure
    .input(createToolUsageInputSchema)
    .mutation(({ input }) => createToolUsage(input)),
  
  // Get tool usage history
  getToolUsageHistory: publicProcedure
    .query(() => getToolUsageHistory()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
