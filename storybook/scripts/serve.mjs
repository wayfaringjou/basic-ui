import * as path from "node:path";
import { readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import inquirer from "inquirer";

// Component libraries for each framework are available as packages
const frameworksDirectory = path.resolve(process.cwd(), "frameworks");

// Look for folders in /packages with storybook configuration
const packages = readdirSync(frameworksDirectory, { withFileTypes: true })
  .filter(
    (dirent) =>
      dirent.isDirectory() &&
      readdirSync(path.resolve(dirent.path, dirent.name)).includes(".storybook")
  )
  .map((directory) => directory.name);

// Prompt for package to run command on
const answer = await inquirer.prompt([
  {
    type: "list",
    name: "package",
    message: "Select framework",
    choices: packages,
  },
]);

// Extract dev/build command type from lifecycle event
const command = process.env.npm_lifecycle_event.replace("sb:", "");
// Use config for selected framework
const arguments_ = [
  "run",
  `storybook-${command}`,
  "-c",
  `${frameworksDirectory}/${answer.package}/.storybook`,
];
// Add output flag for build command
if (command === "build")
  arguments_.push("-o", `${frameworksDirectory}/${answer.package}/storybook-static`);

spawn("yarn", arguments_, { stdio: "inherit" });
