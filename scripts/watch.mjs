import { exec } from "node:child_process";
import * as esbuild from "esbuild";
import getPackageName from "./utils/get-package-name.mjs";

const entry = "src/index.ts";
const outDirectory = "dist";
const outBase = "src";

const workspaceDirectory = process.argv[2];
const { name, version } = getPackageName(workspaceDirectory);

console.log(`\u001B[30;104m Watching ${name} v${version} \u001B[0m`);

const buildContext = await esbuild.context({
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
});

buildContext.watch();

try {
  exec(
    "tsc --build --emitDeclarationOnly --listEmittedFiles --watch",
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
        console.log(`\u001B[0m${stdout} \u001B[0m`);
      }
    }
  );
} catch (error) {
  console.error(`Error compiling types package ${name}:`);
  console.error(error);
}
