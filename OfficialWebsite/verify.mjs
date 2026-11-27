import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
const dist = new URL("./dist/", import.meta.url);
const pages = ["","download/","features/","installation/","faq/","support/","privacy/","terms/"];
for (const prefix of ["","bn/"]) for (const route of pages) {
 const page=await readFile(new URL(prefix+route+"index.html",dist),"utf8");
 assert.match(page,/<meta name="viewport"/);
 assert.match(page,/<link rel="canonical"/);
 assert.equal([...page.matchAll(/<h1[ >]/g)].length,1);
 assert.ok(page.includes('lang="'+(prefix?"bn":"en")+'"'));
 assert.match(page,/<link rel="alternate" hreflang="bn"/);
 assert.doesNotMatch(page,/workers\.dev|ADMIN_PASSWORD|CLOUDFLARE_API_TOKEN/);
 for (const [,target] of page.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
  await access(new URL(target.slice(1)+(target.endsWith("/")?"index.html":""),dist));
 }
}
const download=await readFile(new URL("download/index.html",dist),"utf8");
const release=JSON.parse((await readFile(new URL("./release.json",import.meta.url),"utf8")).replace(/^\uFEFF/,""));
assert.ok(download.includes(release.url));
assert.ok(release.url.startsWith("https://github.com/gmhaasan-eng/iptv/releases/download/")&&release.url.endsWith(".apk"));
assert.match(release.tag,/^v?\d+(\.\d+)+$/);
assert.ok(Number.isFinite(Date.parse(release.date)) && Date.parse(release.date) <= Date.now());
const support=await readFile(new URL("support/index.html",dist),"utf8");
assert.ok(support.includes("mailto:gmltvapp@gmail.com")&&support.includes("https://t.me/LIVEGMLTV"));
assert.ok((await stat(new URL("assets/logo.png",dist))).size<100000);
console.log("Verified 16 bilingual routes, navigation, assets, SEO metadata, release fallback and support links.");

