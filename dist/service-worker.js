if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let l={};const n=e=>i(e,c),o={module:{uri:c},exports:l,require:n};s[c]=Promise.all(r.map((e=>o[e]||n(e)))).then((e=>(t(...e),l)))}}define(["./workbox-79ffe3e0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"groomleta_admin"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/crm-staticfiles/browserconfig.xml",revision:"653d077300a12f09a69caeea7a8947f8"},{url:"/crm-staticfiles/css/app.4711ff6d.css",revision:null},{url:"/crm-staticfiles/css/chunk-vendors.4dfec75b.css",revision:null},{url:"/crm-staticfiles/img/input-error.b766b668.svg",revision:null},{url:"/crm-staticfiles/img/logo.e4c3c67a.svg",revision:null},{url:"/crm-staticfiles/img/logout.8b4b2fb4.svg",revision:null},{url:"/crm-staticfiles/index.html",revision:"2e88181b2f667145d4819004fe4bc0fc"},{url:"/crm-staticfiles/js/app.e82db855.js",revision:null},{url:"/crm-staticfiles/js/chunk-vendors.94be9b57.js",revision:null},{url:"/crm-staticfiles/manifest.json",revision:"9e4db030e147348a07b4d3e0a9d8fdac"},{url:"/crm-staticfiles/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
