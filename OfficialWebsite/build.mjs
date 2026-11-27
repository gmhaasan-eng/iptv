import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { bn, en } from "./content.mjs";

const root = new URL("./", import.meta.url);
const out = new URL("dist/", root);
const origin = (process.env.SITE_URL || "https://gmltv.pages.dev").replace(/\/$/, "");
const github = "https://github.com/gmhaasan-eng/iptv";
const telegram = "https://t.me/LIVEGMLTV";
const email = "gmltvapp@gmail.com";
const release = JSON.parse((await readFile(new URL("release.json", root), "utf8")).replace(/^\uFEFF/, ""));
const slugs = ["","download","features","installation","faq","support","privacy","terms"];
const paths = (lang, index) => "/" + (lang === "bn" ? "bn/" : "") + (slugs[index] ? slugs[index]+"/" : "");
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const photo = (name,alt,loading="lazy") => '<img src="/assets/'+name+'.jpg" alt="'+esc(alt)+'" width="'+(name==="tv"?"1440":"960")+'" height="'+(name==="tv"?"810":"246")+'" loading="'+loading+'" decoding="async">';
const button = (url, text, secondary=false) => '<a class="button'+(secondary?" secondary":"")+'" href="'+esc(url)+'">'+esc(text)+'</a>';
const article = ([title,body]) => '<section class="article"><h2>'+esc(title)+'</h2><p>'+esc(body)+'</p></section>';
const icons = ["▣","☷","☆","▷","⌘","▤"];
function featureGrid(t, number=6) {
 return '<div class="features">'+t.features.slice(0,number).map(([title,body],i)=>'<article class="card"><span class="icon" aria-hidden="true">'+icons[i]+'</span><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p></article>').join("")+'</div>';
}
function content(t, lang, index) {
 const p = i=>paths(lang,i);
 const title = '<header class="page-title"><h1>'+esc(t.nav[index])+'</h1><p>'+esc(t.descriptions[index])+'</p></header>';
 if(index===0)return '<section class="hero"><div class="hero-text"><p class="platform">Android TV <span></span> Android Mobile</p><h1>'+esc(t.hero)+'</h1><p class="lead">'+esc(t.lead)+'</p><div class="actions">'+button(p(1),t.cta)+button(p(3),t.guide,true)+'</div></div><figure class="hero-figure"><div class="screen-frame">'+photo("tv",t.tv,"eager")+'</div><figcaption>'+esc(t.tv)+'</figcaption></figure></section><section class="home-section"><div class="section-head"><h2>'+esc(t.featureTitle)+'</h2><a href="'+p(2)+'">'+esc(t.nav[2])+'</a></div>'+featureGrid(t,3)+'</section><section class="home-section split"><div><h2>'+esc(t.screens)+'</h2><p>'+esc(t.screenText)+'</p>'+button(p(3),t.guide,true)+'</div><figure class="mobile-shot">'+photo("mobile",t.mobile)+'<figcaption>'+esc(t.mobile)+'</figcaption></figure></section>';
 if(index===1){
  const date=new Intl.DateTimeFormat(lang==="bn"?"bn-BD":"en-GB",{dateStyle:"long",timeZone:"Asia/Dhaka"}).format(new Date(release.date));
  return title+'<section class="release-panel"><div><p class="platform">'+esc(t.latest)+'</p><h2 id="release-version">'+esc(release.tag)+'</h2><p class="release-meta"><time id="release-date" datetime="'+esc(release.date)+'">'+date+'</time><span id="release-size">'+(release.size/1048576).toFixed(1)+' MB</span></p></div><div class="actions"><a class="button" id="release-apk" href="'+esc(release.url)+'">'+esc(t.download)+'</a>'+button(github+"/releases",t.releases,true)+'</div></section><section class="article"><h2>'+esc(t.releaseNotes)+'</h2><pre id="release-notes">'+esc(release.notes?.trim()||"")+'</pre><p><a id="release-page" href="'+esc(release.release)+'">GitHub Release</a></p></section><section class="article"><p>'+esc(t.requirements)+'</p><p>'+esc(t.downloadInfo)+'</p>'+button(p(3),t.guide,true)+'</section><script src="/release.js" defer></script>';
 }
 if(index===2)return title+featureGrid(t)+'<div class="actions below">'+button(p(1),t.cta)+'</div>';
 if(index===3)return title+'<div class="install-grid">'+t.install.map(([name,steps])=>'<section class="card"><h2>'+esc(name)+'</h2><ol>'+steps.map(step=>'<li>'+esc(step)+'</li>').join("")+'</ol></section>').join("")+'</div><p class="note">'+esc(t.installTip)+'</p><div class="actions">'+button(p(1),t.cta)+'</div>';
 if(index===4)return title+'<div class="accordion">'+t.faq.map(([q,a],i)=>'<details'+(i===0?" open":"")+'><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join("")+'</div>';
 if(index===5)return title+'<section class="support-grid"><div class="card"><h2>'+esc(t.nav[5])+'</h2><p>'+esc(t.supportLead)+'</p><p class="address">'+email+'</p><div class="actions">'+button("mailto:"+email,t.email)+button(telegram,t.telegram,true)+'</div><p class="note">'+esc(t.supportTip)+'</p></div><figure class="qr card"><a href="'+telegram+'"><img src="/assets/telegram.png" width="240" height="240" alt="'+esc(t.scan)+'"></a><figcaption>'+esc(t.scan)+'</figcaption></figure></section>';
 return title+'<p class="muted">'+esc(t.updated)+'</p><div class="prose">'+(index===6?t.privacy:t.terms).map(article).join("")+'</div>';
}
function render(t, lang, index) {
 const p=i=>paths(lang,i), translated=paths(lang==="en"?"bn":"en",index);
 const pageTitle=(index===0?"GMLTV · Android TV & Mobile IPTV Player":t.nav[index]+" · GMLTV");
 const nav=t.nav.slice(0,6).map((label,i)=>'<a href="'+p(i)+'"'+(i===index?' aria-current="page"':'')+'>'+esc(label)+'</a>').join("");
 const footer=[1,3,5,6,7].map(i=>'<a href="'+p(i)+'">'+esc(t.nav[i])+'</a>').join("");
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071225"><title>'+esc(pageTitle)+'</title><meta name="description" content="'+esc(t.descriptions[index])+'"><link rel="canonical" href="'+origin+p(index)+'"><link rel="alternate" hreflang="en" href="'+origin+paths("en",index)+'"><link rel="alternate" hreflang="bn" href="'+origin+paths("bn",index)+'"><meta property="og:title" content="'+esc(pageTitle)+'"><meta property="og:description" content="'+esc(t.descriptions[index])+'"><meta property="og:type" content="website"><meta property="og:image" content="'+origin+'/assets/tv.jpg"><link rel="icon" href="/assets/logo.png"><link rel="stylesheet" href="/style.css"></head><body><a class="skip" href="#main">'+(lang==="bn"?"মূল অংশে যান":"Skip to content")+'</a><header class="site-header"><div class="shell header-inner"><a class="brand" href="'+p(0)+'"><img src="/assets/logo.png" width="38" height="38" alt=""><span>GMLTV</span></a><nav aria-label="'+(lang==="bn"?"প্রধান নেভিগেশন":"Main navigation")+'">'+nav+'</nav><a class="language" href="'+translated+'" lang="'+(lang==="en"?"bn":"en")+'">'+(lang==="en"?"বাংলা":"English")+'</a></div></header><main id="main" class="shell '+(index===0?"home":"inner")+'">'+content(t,lang,index)+'</main><footer class="site-footer"><div class="shell footer-inner"><div><a class="brand" href="'+p(0)+'"><img src="/assets/logo.png" width="32" height="32" alt=""><span>GMLTV</span></a><p>'+esc(t.copyright)+'</p></div><nav aria-label="'+(lang==="bn"?"ফুটার":"Footer")+'">'+footer+'</nav></div></footer></body></html>';
}
await mkdir(out,{recursive:true});
await cp(new URL("static/",root),out,{recursive:true});
for (const [lang,t] of [["en",en],["bn",bn]]) for(let i=0;i<slugs.length;i++){
 const dir=new URL(paths(lang,i).slice(1),out);
 await mkdir(dir,{recursive:true});
 await writeFile(new URL("index.html",dir),render(t,lang,i));
}
await writeFile(new URL("robots.txt",out),"User-agent: *\nAllow: /\nSitemap: "+origin+"/sitemap.xml\n");
await writeFile(new URL("sitemap.xml",out),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+["en","bn"].flatMap(lang=>slugs.map((_,i)=>'<url><loc>'+origin+paths(lang,i)+'</loc></url>')).join("")+'</urlset>');
await writeFile(new URL("404.html",out),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page unavailable · GMLTV</title><link rel="stylesheet" href="/style.css"><main class="shell inner"><h1>Page unavailable</h1><a class="button" href="/">GMLTV Home</a></main></html>');
console.log("Built 16 pages for "+origin);

