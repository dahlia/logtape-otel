import { build, emptyDir } from "@deno/dnt";
import metadata from "./deno.json" with { type: "json" };

await emptyDir("./npm");

const importMap = ".dnt-import-map.json";
await Deno.writeTextFile(
  importMap,
  JSON.stringify({
    imports: {
      ...metadata.imports,
      "@logtape/logtape": metadata.imports["@logtape/logtape"]
        .replace(/^jsr:/, "npm:"),
    },
  }),
);

await build({
  package: {
    name: "@logtape/otel",
    version: Deno.args[0] ?? metadata.version,
    description: "LogTape OpenTelemetry Sink",
    keywords: ["LogTape", "OpenTelemetry", "otel"],
    license: "MIT",
    author: {
      name: "Hong Minhee",
      email: "hong@minhee.org",
      url: "https://hongminhee.org/",
    },
    homepage: "https://github.com/dahlia/logtape-otel",
    repository: {
      type: "git",
      url: "git+https://github.com/dahlia/logtape-otel.git",
    },
    bugs: {
      url: "https://github.com/dahlia/logtape-otel/issues",
    },
    funding: [
      "https://github.com/sponsors/dahlia",
    ],
  },
  outDir: "./npm",
  entryPoints: ["./mod.ts"],
  importMap: ".dnt-import-map.json",
  shims: {
    deno: "dev",
  },
  typeCheck: "both",
  declaration: "separate",
  declarationMap: true,
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  async postBuild() {
    await Deno.copyFile("LICENSE", "npm/LICENSE");
    await Deno.copyFile("README.md", "npm/README.md");
  },
});

await Deno.remove(importMap);

// cSpell: ignore Minhee
