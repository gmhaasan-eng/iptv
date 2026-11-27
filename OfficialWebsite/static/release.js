const root = "https://github.com/gmhaasan-eng/iptv/";
const official = (url, path) => typeof url === "string" && url.startsWith(root + path);
async function refreshRelease() {
  const response = await fetch("https://api.github.com/repos/gmhaasan-eng/iptv/releases/latest", {signal:AbortSignal.timeout(6000)});
  if (!response.ok) return;
  const release = await response.json();
  const asset = release.assets?.find(item => /^GMLTV[-._][\w.-]+\.apk$/i.test(item.name) &&
    official(item.browser_download_url,"releases/download/"));
  const date = new Date(release.published_at);
  if (release.draft || release.prerelease || !asset || !Number.isFinite(date.getTime()) ||
      !official(release.html_url,"releases/tag/") || !/^v?\d+(\.\d+)+$/i.test(release.tag_name)) return;
  const set = (id,value) => { document.getElementById(id).textContent=value; };
  set("release-version",release.tag_name);
  set("release-date",new Intl.DateTimeFormat(document.documentElement.lang==="bn"?"bn-BD":"en-GB",{dateStyle:"long",timeZone:"Asia/Dhaka"}).format(date));
  document.getElementById("release-date").dateTime=release.published_at;
  set("release-size",(asset.size/1048576).toFixed(1)+" MB");
  set("release-notes",release.body?.trim()||"");
  document.getElementById("release-apk").href=asset.browser_download_url;
  document.getElementById("release-page").href=release.html_url;
}
refreshRelease().catch(()=>{ /* Keep the published fallback if GitHub is unavailable. */ });

