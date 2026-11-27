# GMLTV website verification

- Static build generated eight page types in English and Bangla, plus a 404 page, sitemap, robots.txt and response headers.
- The route checks passed for all 16 pages, including internal navigation, assets, canonical and alternate-language links.
- Browser layout checks passed for the Home page at 390 and 1366 pixels and the Bangla Download page at 1920 pixels. None of those tested pages overflowed horizontally.
- Browser checks confirmed the Bangla Download page shows v2.21 with its official APK link. GitHub's public latest stable release was v2.21 at verification time. The APK download and official Telegram link both returned HTTP 200. The Telegram QR was decoded locally and matched https://t.me/LIVEGMLTV.
- The public site contains no Admin endpoint, secrets, analytics code or database connection. GitHub release content is rendered as text. Privacy copy reflects the reviewed Android and Worker code. This change only adds files under OfficialWebsite.
- GitHub production branch: gmltv-official-website. Cloudflare Pages builds OfficialWebsite using node build.mjs && node verify.mjs, then serves dist.
