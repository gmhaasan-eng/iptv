# GMLTV official website

This folder builds 16 static pages in English and Bangla. The published APK comes from the official GitHub Releases. The site checks GitHub's latest stable release when the Download page loads and keeps the checked-in release snapshot available if GitHub is temporarily unavailable. Publish a stable release with an uploaded GMLTV APK to update the Download page. Update `release.json` when you want the fallback to match the latest release.

## Build and validate

```sh
node build.mjs
node verify.mjs
```

No package installation is required. The website uses only the files generated in `dist/`.

## Cloudflare Pages

- Account: GMLTV
- Git repository: `gmhaasan-eng/iptv`
- Root directory: `OfficialWebsite`
- Framework preset: None
- Build command: `node build.mjs && node verify.mjs`
- Build output directory: `dist`
- Production branch: `main`
- Optional `SITE_URL`: the actual public Pages origin if the hostname differs from `gmltv.pages.dev`.

Use a feature branch for preview. The Pages project has no Worker or database bindings. The source belongs in this separate folder so the playlist files remain independent.

