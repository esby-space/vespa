import express, { Express } from "express";
import { Server } from "http";

const resolve = (path: string) => new URL(path, import.meta.url).pathname;

export const PRODUCTION = process.env.NODE_ENV == "production";

const serve = (app: Express, port: number, callback: () => void) => {
    const server = app.listen(port, callback);
    PRODUCTION ? serveProd(app) : serveDev(app, server);
};

const serveDev = async (app: Express, server: Server) => {
    const { createServer } = await import ("vite");
    const dev = await createServer({ server: { middlewareMode: true } });
    app.use(dev.middlewares);
    server.on("close", dev.close);
};

const serveProd = (app: Express) => { app.use(express.static(resolve("../../client/"))) };

export default serve;

