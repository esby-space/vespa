import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import serve from "./lib/serve.js";
import { createContext } from "./lib/trpc.js";
import router from "./routers/app.js";
import { run } from "./lib/prisma.js";

const PORT = (process.env.PORT ?? 3000) as number;

const main = async () => {
    const app = express();
    app.use("/trpc", createExpressMiddleware({ router, createContext }));
    serve(app, PORT, () => console.log(`app is running at localhost:${PORT}`));
};

run(main);

