import trpc from "../lib/trpc.js";
import auth from "./auth.js";

const router = trpc.mergeRouters(auth);

export default router;
export type Router = typeof router;

