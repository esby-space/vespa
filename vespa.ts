import { mkdir, readFile, readdir, rename, rm, writeFile } from "fs/promises";
import { relative, resolve } from "path";
import { Plugin } from "vite";

const TEMPLATE_PATH = "./src/client/template.html";
const PAGES_PATH = "./src/client/pages/";
const TEMP_PATH = "./src/";
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
            console.log(path);
            response.writeHead(200, { "Content-type": "text/html" });
            response.end(template.replace("<!--vespa-src-->", path));
        });
    },

    // for build, configure rollup to accept inputs
    async config(_, { command }) {
        if (command != "build") return;

        const input: { [key: string]: string } = {};
        const paths = (await readdir(resolve(PAGES_PATH))).map((file) => resolve(TEMP_PATH, file.replace(".tsx", ".html")));
        (await readdir(resolve(PAGES_PATH))).map((file) => file.replace(/\..+/, "")).forEach((file, i) => input[file] = paths[i]);

        return { build: { rollupOptions: { input } } }
    },

    // generate temp files after build is done, before output generation starts
    async buildEnd() {
        await rm(resolve(TEMP_PATH), { recursive: true, force: true }).catch(() => console.log("not there"));
        await mkdir(resolve(TEMP_PATH));

        const template = await readFile(resolve(TEMPLATE_PATH), "utf-8");
        (await readdir(resolve(PAGES_PATH))).forEach(async (file) => await writeFile(resolve(TEMP_PATH, file.replace(".tsx", ".html")), template.replace("<!--vespa-src-->", `${relative(TEMP_PATH, PAGES_PATH)}/${file}`)));
    },

    // cleanup temp file, move result files to final place
    async closeBundle() {
        const files = await readdir(resolve(DIST_PATH, TEMP_PATH));
        files.forEach(async (file) => await rename(resolve(DIST_PATH, TEMP_PATH, file), resolve(DIST_PATH, file)));
        await rm(resolve(DIST_PATH, TEMP_PATH), { recursive: true, force: true });
    }
});

export default vespa;

