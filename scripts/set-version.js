import { execSync } from "node:child_process";
import fs from "node:fs";

const commit = execSync("git rev-parse --short HEAD").toString().trim();
const version = JSON.parse(fs.readFileSync("package.json")).version;

fs.writeFileSync(
  ".env.local",
  `NEXT_PUBLIC_APP_VERSION=${version}\nNEXT_PUBLIC_GIT_COMMIT=${commit}\n`,
);

console.log(`Version set: ${version} (${commit})`);
