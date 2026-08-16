#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";

const root = process.cwd();
const srcDir = join(root, "api", "src");
let failed = false;

function collectJsFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectJsFiles(full, out);
    else if (name.endsWith(".js")) out.push(full);
  }
  return out;
}

const files = collectJsFiles(srcDir);
if (!files.length) {
  console.log("No API JS files to check.");
  process.exit(0);
}

for (const file of files) {
  const rel = relative(root, file);
  console.log(`==> node --check ${rel}`);
  const result = spawnSync("node", ["--check", file], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
