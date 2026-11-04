import { copyFileSync, writeFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

console.log("Preparing GitHub Pages artifacts...");
copyFileSync(resolve(distDir, "index.html"), resolve(distDir, "404.html"));
writeFileSync(resolve(distDir, ".nojekyll"), "");

console.log("Pushing build artifacts to gh-pages branch...");
const gitCmds = [
  "git init",
  "git checkout -B gh-pages",
  "git add -A",
  'git commit -m "deploy: update GitHub Pages build"',
  "git remote add origin https://github.com/ANafeesh/SmartStay.git",
  "git push -f origin gh-pages",
];

try {
  execSync(gitCmds.join(" && "), { cwd: distDir, stdio: "inherit" });
  console.log("GitHub Pages deployed successfully!");
} finally {
  try {
    rmSync(resolve(distDir, ".git"), { recursive: true, force: true });
  } catch {
    // Ignore cleanup error
  }
}

