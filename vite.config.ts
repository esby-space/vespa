import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import vespa from "./vespa";

export default defineConfig({
    plugins: [solid(), vespa()],
    server: { port: 5000 },
    build: { outDir: "dist/client" }
});

