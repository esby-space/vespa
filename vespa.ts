import { mkdir, readFile, readdir, rename, rm, writeFile } from "fs/promises";
import { relative, resolve } from "path";
import { Plugin } from "vite";

const TEMPLATE_PATH = "./src/client/template.html";
const TEMP_PATH = "./temp/";
const PAGES_PATH = "./src/client/pages/";
const DIST_PATH = "./dist/client/";

const vespa = (): Plugin => ({
    name: "vespa",

    // for dev, intercept request and return transformed html
    async configureServer({ middlewares: app }) {
        const template = await readFile(resolve(TEMPLATE_PATH), "utf-8");
        const files = (await readdir(resolve(PAGES_PATH))).map((file) => file.replace(/\..+/, ""));

        app.use(async (request, response, next) => {
            if (request.url == "/") request.url = "/index.html";
            const requested = files.find((file) => request.url?.match(new RegExp(`\/${file}(\.html)?$`)));
            if (!requested) return next();

            const path = `${resolve(PAGES_PATH, requested)}.tsx`;
            response.writeHead(200, { "Content-type": "text/html" });
            response.end(template.replace("<!--vespa-src-->", path));
        });
    },

    async config(_, { command }) {
        if (command != "build") return;

        // generate rollup config to accept inputs
        const pages = await readdir(resolve(PAGES_PATH));
        const input: { [key: string]: string } = {};
        const paths = pages.map((file) => resolve(TEMP_PATH, file.replace(/\..+/, ".html")));
        pages.map((file) => file.replace(/\..+/, "")).forEach((file, i) => (input[file] = paths[i]));

        // make temp directory
        await mkdir(resolve(TEMP_PATH));

        // generate html files from template
        const template = await readFile(resolve(TEMPLATE_PATH), "utf-8");
        pages.forEach(
            async (file) =>
                await writeFile(
                    resolve(TEMP_PATH, file.replace(/\..+/, ".html")),
                    template.replace("<!--vespa-src-->", `${relative(TEMP_PATH, PAGES_PATH)}/${file}`)
                )
        );

        return { build: { rollupOptions: { input } } };
    },

    // cleanup temp files
    async closeBundle() {
        const files = await readdir(resolve(DIST_PATH, TEMP_PATH));
        files.forEach(async (file) => await rename(resolve(DIST_PATH, TEMP_PATH, file), resolve(DIST_PATH, file)));
        await rm(resolve(DIST_PATH, TEMP_PATH), { recursive: true, force: true });
        await rm(resolve(TEMP_PATH), { recursive: true, force: true });
    },
});

export default vespa;
