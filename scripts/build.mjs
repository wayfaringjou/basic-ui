/* eslint-disable unicorn/no-process-exit */
import { exec } from "node:child_process";
import * as esbuild from "esbuild";
import getPackageName from "./utils/get-package-name.mjs";

const entry = "src/index.ts";
const outDirectory = "dist";
const outBase = "src";

const workspaceDirectory = process.argv[2];
const { name, version } = getPackageName(workspaceDirectory);

console.log(`\u001B[30;104m ${name} v${version} \u001B[0m`);
console.log(`\u001B[96m [Bundling module] \u001B[0m\n`);

const result = await esbuild
  .build({
    entryPoints: [`${workspaceDirectory}/${entry}`],
    outdir: `${workspaceDirectory}/${outDirectory}`,
    outbase: `${workspaceDirectory}/${outBase}`,
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["es6"],
    outExtension: { ".js": ".mjs" },
    packages: "external",
    metafile: true,
    color: true,
  })
  .catch(() => process.exit(1));

if (result?.metafile) {
  console.log("\u001B[92m Succesfully compiled: \u001B[0m");
  console.log(await esbuild.analyzeMetafile(result.metafile));
} else {
  console.error("Empty build results");
  process.exit(1);
}

console.log(`\u001B[96m [Bundling types] \u001B[0m\n`);
try {
  exec(
    "tsc --build --emitDeclarationOnly --listEmittedFiles",
    {
      cwd: workspaceDirectory,
    },
    (error, stdout, stderr) => {
      const colorCode = error ? 91 : 92;
      if (error) {
        console.error(`\u001B[0m ${error}\u001B[0m`);
        console.error(`\u001B[${colorCode}m ${stderr || stdout}\u001B[0m`);
        return;
      }
      if (stdout) {
        console.log("\u001B[92m Succesfully compiled: \u001B[0m");
        console.log(`\u001B[0m${stdout} \u001B[0m`);
      } else {
        console.log("\u001B[92m Types for this package are up to date. \u001B[0m\n");
      }
    }
  );
} catch (error) {
  console.error(`Error compiling types package ${name}:`);
  console.error(error);
}
