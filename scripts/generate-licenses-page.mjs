import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const licensesPath = path.join(root, "docs", "oss-licenses.json");
const outPath = path.join(root, "docs", "licenses", "index.html");

const licenses = JSON.parse(fs.readFileSync(licensesPath, "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const entries = Object.entries(licenses).sort(([a], [b]) =>
  a.localeCompare(b, "en"),
);

const items = entries
  .map(([name, info]) => {
    const license = escapeHtml(info.licenses || "Unknown");
    const repoBlock = info.repository
      ? `      <p>Repository: <a href="${escapeHtml(info.repository)}">${escapeHtml(info.repository)}</a></p>\n`
      : "";

    return `    <article class="license-entry">
      <h2 class="license-name">${escapeHtml(name)}</h2>
      <p>License: ${license}</p>
${repoBlock}    </article>`;
  })
  .join("\n\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Open Source Licenses</title>
  <meta name="description" content="Third-party open source software licenses used in A.D.A - Artem D." />
  <link rel="stylesheet" href="../assets/style.css" />
</head>
<body>
  <div class="container">

    <header>
      <div class="site-title">A.D.A - Artem D</div>
    </header>

    <main>
      <h1>Open Source Licenses</h1>

      <div class="license-list">
${items}
      </div>

      <p class="license-disclaimer">This page lists third-party open source software used in the app.</p>
    </main>

    <footer>
      © 2026 A.D.A - Artem D
    </footer>

  </div>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath} (${entries.length} packages)`);
