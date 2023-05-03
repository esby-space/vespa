import { initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = (opts: CreateExpressContextOptions) => ({ request: opts.req, response: opts.res });
const trpc = initTRPC.context<typeof createContext>().create();
export default trpc;

