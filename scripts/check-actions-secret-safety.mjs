#!/usr/bin/env node
/**
 * Fail CI/local lint if GitHub Actions workflows look likely to leak secrets.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const WORKFLOWS_DIR = join(ROOT, ".github", "workflows");

const errors = [];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.ya?ml$/i.test(name)) out.push(p);
  }
  return out;
}

function rel(p) {
  return relative(ROOT, p).replaceAll("\\", "/");
}

function addError(file, line, message) {
  errors.push(`${rel(file)}:${line}: ${message}`);
}

const files = walk(WORKFLOWS_DIR);

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, i) => {
    if (/BEGIN ([A-Z]+ )?PRIVATE KEY/.test(line) || /BEGIN OPENSSH PRIVATE KEY/.test(line)) {
      addError(file, i + 1, "Private key material must never appear in workflow files.");
    }
  });

  lines.forEach((line, i) => {
    if (/^\s*private-key\s*:/.test(line)) {
      addError(
        file,
        i + 1,
        "Do not pass private-key via action `with:` (logged in cleartext).",
      );
    }
  });

  if (/GITHUB-APP-PRIVATE-KEY/.test(text)) {
    const lineNo = lines.findIndex((l) => l.includes("GITHUB-APP-PRIVATE-KEY")) + 1;
    addError(
      file,
      lineNo || 1,
      "GITHUB-APP-PRIVATE-KEY must not appear inline in a workflow.",
    );
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const m =
      trimmed.match(/^echo\s+[\"']::add-mask::\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?[\"']\s*$/) ||
      trimmed.match(/^printf\s+[\"']::add-mask::%s\\n[\"']\s+[\"']?\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?[\"']?\s*$/);
    if (!m) return;
    const varName = m[1];
    if (/(PRIVATE_KEY|PRIVATEKEY|PEM|CERT|CERTIFICATE)$/i.test(varName) || /^KEY_PEM$/i.test(varName)) {
      addError(
        file,
        i + 1,
        `Unsafe multiline mask: echo/printf "::add-mask::$${varName}" dumps PEM body lines to the log. Mask line-by-line from a file.`,
      );
    }
  });

  if (/echo\s+[\"']::add-mask::\$value[\"']/.test(text) || /echo\s+[\"']::add-mask::\$\{value\}[\"']/.test(text)) {
    const lineNo = lines.findIndex((l) => /echo\s+[\"']::add-mask::\$\{?value\}?[\"']/.test(l)) + 1;
    addError(
      file,
      lineNo || 1,
      'Unsafe multiline mask helper (`echo "::add-mask::$value"`). Use line-by-line masking only.',
    );
  }
}

if (errors.length) {
  console.error("Actions secret-safety check failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Actions secret-safety check passed (${files.length} workflow file(s)).`);
