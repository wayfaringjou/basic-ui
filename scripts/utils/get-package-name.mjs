import { readFileSync } from "node:fs";

/**
 * Get package data from package.json file
 * @param {string} packageDirectory - package directory
 * @returns {{name: string, version: string}} name and version
 */
export default function getPackageName(packageDirectory) {
  try {
    const packageData = JSON.parse(
      readFileSync(`${packageDirectory}/package.json`, "utf8")
    );
    const { name, version } = packageData;

    return { name, version };
  } catch (error) {
    console.error(`Error getting data from ${packageDirectory}/package.json:`);
    console.error(error);
  }
}
