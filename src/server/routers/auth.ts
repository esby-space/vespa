import trpc from "../lib/trpc.js";
import auth from "../lib/auth.js";
import z from "zod";

export default trpc.router({
    auth: trpc.procedure.query(async ({ ctx }) => {
        const authRequest = auth.handleRequest(ctx.request, ctx.response);
        return await authRequest.validateUser();
    }),

    login: trpc.procedure.input(z.object({
        username: z.string(),
        password: z.string()
    })).query(async ({ input, ctx }) => {
        const authRequest = auth.handleRequest(ctx.request, ctx.response);
        const key = await auth.useKey("username", input.username, input.password);
        const session = await auth.createSession(key.userId);
        authRequest.setSession(session);
    }),

    signup: trpc.procedure.input(z.object({
        username: z.string(),
        password: z.string()
    })).query(async ({input, ctx}) => {
        const authRequest = auth.handleRequest(ctx.request, ctx.response);
        const user = await auth.createUser({
            attributes: { userId: input.username },
            primaryKey: {
                providerId: "username",
                providerUserId: input.username,
                password: input.password
            },
        });
        const session = await auth.createSession(user.userId);
        authRequest.setSession(session);
    })
});

