import lucia from "lucia-auth";
import client from "./prisma.js";
import prisma from "@lucia-auth/adapter-prisma";
import { express } from "lucia-auth/middleware";
import { PRODUCTION } from "./serve.js";

const auth = lucia({
    env: PRODUCTION ? "PROD" : "DEV",
    adapter: prisma(client),
    middleware: express(),
    transformDatabaseUser(user) {
        return {
            userId: user.id,
            username: user.username
        } 
    },
});

export default auth;

