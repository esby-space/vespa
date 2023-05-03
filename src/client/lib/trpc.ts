import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { Router } from "../../server/routers/app";
import { inferRouterOutputs } from "@trpc/server";

const trpc = createTRPCProxyClient<Router>({ links: [httpBatchLink({ url: "/trpc" })] });

export type Response = inferRouterOutputs<Router>;
export default trpc;

