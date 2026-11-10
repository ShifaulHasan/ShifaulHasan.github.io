const W = "http://www.banglasoftcomputer.com";
const CERTS = [
  { cat:"course", file:"using-generative-ai-manuscript-preparation-certificate", title:"Using Generative AI in Manuscript Preparation", issuer:"Elsevier Researcher Academy",
    meta:"2 November 2026 · Online module",
    desc:"Certificate of completion for the online module on using generative AI in manuscript preparation, presented by Dr. Inez van Korlaar.", links:[] },
  { cat:"work", file:"internship-bangla-soft-computer-redacted", title:"Web development internship certificate", issuer:"Bangla Soft Computer",
    meta:"1 October 2025 – 13 January 2026 · issued 13 January 2026",
    desc:"Completed a web development internship as a Web Developer, building an inventory management and smart billing system. Performance and conduct rated excellent, with good communication skills and the ability to work independently and in a team.",
    links:[[W,"Company website ↗"]] },
  { cat:"event", title:"Project showcase, IUBAT IGNITRON 25.1", issuer:"Department of EEE and IUBAT Robotics Club, IUBAT",
    meta:"1 August 2025 · Certificate of participation",
    desc:"Presented the group project Automatic Railway Gate Control System in the Project Showcasing segment of IUBAT IGNITRON 25.1.",
    img:"IUBAT_IGNITRON_Certificate.jpeg", pdf:"IUBAT_IGNITRON_Certificate.pdf", links:[] },
  { cat:"course", file:"python-django-edge", title:"Python (Django) training", issuer:"Jagannath University CSE · EDGE Project, Bangladesh Computer Council (ICT Division)",
    meta:"Nov 2024 – Jun 2025 · 80 hours · issued 22 July 2025",
    desc:"Completed an 80-hour training on web development with Python and Django, conducted by the Department of CSE, Jagannath University under the EDGE Project.",
    serial:["Serial no.","EDGE-DSTS-106-2630-00016"], links:[["https://training.edge.gov.bd/certificate-validation","Verify online ↗"]] },
  { cat:"course", file:"python-coder-kaggle", title:"Python Coder badge", issuer:"Kaggle", meta:"15 April 2025",
    desc:"Badge for proficiency in core Python programming concepts.", pdf:false,
    links:[["https://www.kaggle.com/certification/badges/mdshifaulhasan/30","Verify on Kaggle ↗"]] },
  { cat:"course", file:"machine-learning-simplilearn", title:"Machine Learning course completion", issuer:"Simplilearn SkillUp", meta:"7 April 2025",
    desc:"Foundational training in machine learning algorithms and concepts.",
    serial:["Certificate code","8153159"], links:[["https://www.simplilearn.com/contact-us","Contact Simplilearn to verify ↗"]] },
  { cat:"course", file:"ai-for-beginners-hp-life", title:"AI for Beginners", issuer:"HP LIFE (HP Foundation)", meta:"20 March 2025",
    desc:"Key AI concepts and applications, why data matters for AI, how businesses use it, and its ethical implications.",
    serial:["Serial no.","2fb18610-49d1-444d-ac22-1fa7f68e7610"], links:[["https://www.life-global.org/certificate/2fb18610-49d1-444d-ac22-1fa7f68e7610","Verify online ↗"]] },
  { cat:"course", title:"How to write an abstract and improve your article", issuer:"Elsevier Researcher Academy", meta:"18 March 2025 · 40-minute online module",
    desc:"Certificate of completion for the online module on writing an abstract and improving an article, presented by Hannah Foreman.",
    img:"Researcher Academy_Certificate.jpeg", pdf:"Researcher Academy_Certificate.pdf", links:[] },
  { cat:"course", file:"data-analysis-excel-futurenation", title:"Data Analysis with Excel", issuer:"FutureNation (Grameenphone and UNDP initiative)", meta:"17 March 2025",
    desc:"Data analysis, data manipulation and reporting using Microsoft Excel.", links:[] },
  { cat:"course", file:"ostad-data-science-fundamentals", title:"Data Science Fundamentals", issuer:"Ostad", meta:"Certificate of completion",
    desc:"Course completion certificate in data science fundamentals.", serial:["Certificate ID","C23947"], links:[] },
  { cat:"course", file:"ostad-product-management-basics", title:"Basics of Product Management", issuer:"Ostad", meta:"Certificate of completion",
    desc:"Course completion certificate in the basics of product management.", serial:["Certificate ID","C23948"], links:[] }
];
const CAT_NAMES = { all:"All", work:"Work", course:"Courses", event:"Events" };
const certPath = f => encodeURI("certificates/" + f);
CERTS.forEach(c => {
  c.imgUrl = certPath(c.img || c.file + ".jpg");
  c.pdfUrl = c.pdf === false ? "" : certPath(c.pdf || c.file + ".pdf");
});

const grid = document.getElementById("cert-grid");
const box = document.getElementById("lightbox");
function openBox(c) {
  box.querySelector("h3").textContent = c.title;
  const im = box.querySelector("img"); im.src = c.imgUrl; im.alt = "Certificate: " + c.title;
  const links = [];
  if (c.pdfUrl) links.push(`<a class="verify" href="${c.pdfUrl}" target="_blank" rel="noopener">Open PDF</a>`);
  (c.links || []).forEach(([u, l]) => links.push(`<a class="verify" href="${u}" target="_blank" rel="noopener">${l}</a>`));
  box.querySelector(".lb-links").innerHTML = links.join("");
  box.showModal();
}
box.addEventListener("click", e => { if (e.target === box) box.close(); });
box.querySelector(".lb-close").addEventListener("click", () => box.close());

function renderCerts(cat) {
  grid.innerHTML = "";
  CERTS.filter(c => cat === "all" || c.cat === cat).forEach(c => {
    const el = document.createElement("article");
    el.className = "edu-card cert";
    el.innerHTML = `
      <button class="thumb" type="button" aria-label="Preview certificate: ${c.title}"><img src="${c.imgUrl}" alt="Certificate image: ${c.title}" loading="lazy"></button>
      <h3>${c.title}</h3>
      ${c.issuer ? `<p class="school">${c.issuer}</p>` : ""}
      ${c.meta ? `<p class="meta">${c.meta}</p>` : ""}
      ${c.desc ? `<p class="desc">${c.desc}</p>` : ""}
      ${c.serial ? `<p class="serial"><span>${c.serial[0]}</span> <code>${c.serial[1]}</code> <button type="button" class="chip copy-serial" data-copy="${c.serial[1]}">Copy</button></p>` : ""}
      <div class="cert-links">
        ${c.pdfUrl ? `<a class="verify" href="${c.pdfUrl}" target="_blank" rel="noopener">View certificate (PDF)</a>` : ""}
        ${(c.links || []).map(([u, l]) => `<a class="verify" href="${u}" target="_blank" rel="noopener">${l}</a>`).join("")}
      </div>`;
    const t = el.querySelector(".thumb");
    t.querySelector("img").addEventListener("error", () => { t.classList.add("noimg"); t.querySelector("img").remove(); });
    t.addEventListener("click", () => openBox(c));
    grid.appendChild(el);
  });
}
const certFilters = document.getElementById("cert-filters");
Object.keys(CAT_NAMES).forEach((k, i) => {
  const b = document.createElement("button");
  b.className = "chip" + (i === 0 ? " active" : ""); b.type = "button"; b.textContent = CAT_NAMES[k];
  b.addEventListener("click", () => {
    certFilters.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === b));
    renderCerts(k);
    grid.querySelectorAll(".edu-card").forEach(el => el.classList.add("reveal", "in"));
  });
  certFilters.appendChild(b);
});
renderCerts("all");

const root = document.documentElement;
document.getElementById("theme").addEventListener("click", () => {
  const dark = getComputedStyle(root).getPropertyValue("--paper").trim() === "#0D1B20";
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

const chips = document.querySelectorAll(".filters .chip");
const projects = document.querySelectorAll(".project");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.toggle("active", c === chip));
  projects.forEach(p => { p.hidden = chip.dataset.filter !== "all" && p.dataset.cat !== chip.dataset.filter; });
}));

const copy = document.getElementById("copy");
copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("email").textContent);
    copy.textContent = "Copied";
  } catch (e) { copy.textContent = "Press Ctrl+C"; }
  setTimeout(() => (copy.textContent = "Copy email"), 1800);
});

document.getElementById("year").textContent = new Date().getFullYear();

const typed = document.getElementById("typed");
const words = ["medical image classification", "speech emotion recognition", "deep learning research", "full-stack web development"];
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!still) {
  let w = 0, c = words[0].length, del = true;
  (function tick() {
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (del) { c--; if (c < 0) { del = false; w = (w + 1) % words.length; c = 0; } }
    else { c++; if (c > words[w].length) { del = true; c = words[w].length; return setTimeout(tick, 1600); } }
    setTimeout(tick, del ? 35 : 70);
  })();
}

const counters = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  counters.unobserve(e.target);
  const el = e.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
  if (still) return;
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1200, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (end * ease).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: .6 });
document.querySelectorAll("[data-count]").forEach(el => counters.observe(el));

const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".pub, .project, .timeline .item, .edu-card, .cv-card, .skills, .intro, section h2").forEach(el => {
  el.classList.add("reveal"); reveal.observe(el);
});

const hero = document.getElementById("hero");
const ring = document.querySelector(".ring");
if (!still) hero.addEventListener("mousemove", e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
  hero.style.setProperty("--my", (e.clientY - r.top) + "px");
  const px = (e.clientX / innerWidth - .5), py = (e.clientY / innerHeight - .5);
  ring.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
});
hero.addEventListener("mouseleave", () => (ring.style.transform = ""));

const bar = document.getElementById("progress");
const topBtn = document.getElementById("top-btn");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  topBtn.classList.toggle("show", h.scrollTop > 600);
}, { passive: true });
topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const MY_EMAIL = "shifaulhasantaship@gmail.com";
form.addEventListener("submit", async e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];
  let ok = true;
  fields.forEach(f => { const bad = !f.value.trim() || (f.type === "email" && !f.checkValidity()); f.classList.toggle("invalid", bad); if (bad) ok = false; });
  if (!ok) { status.className = "status err"; status.textContent = "Please fill in every field with a valid email."; return; }
  const d = Object.fromEntries(new FormData(form));
  if (d._gotcha) return;
  const btn = form.querySelector("button");
  if (form.action.includes("YOUR_FORM_ID")) {
    const body = `${d.message}\n\nFrom: ${d.name} (${d.email})`;
    location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
    status.className = "status ok"; status.textContent = "Opening your email app...";
    return;
  }
  btn.disabled = true; status.className = "status"; status.textContent = "Sending...";
  try {
    const r = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
    if (!r.ok) throw new Error();
    form.reset(); status.className = "status ok"; status.textContent = "Thank you! Your message has been sent.";
  } catch (err) {
    status.className = "status err"; status.textContent = "Could not send. Please email me directly at " + MY_EMAIL;
  }
  btn.disabled = false;
});
form.addEventListener("input", e => e.target.classList.remove("invalid"));

document.addEventListener("click", async e => {
  const btn = e.target.closest(".copy-serial");
  if (!btn) return;
  try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "Copied"; }
  catch (err) { btn.textContent = "Select and copy"; }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
});

(function () {
  const cv = document.getElementById("neural");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  let w, h, nodes = [], mouse = { x: -999, y: -999 }, color = [43, 108, 176], running = true;
  const hexToRgb = s => { s = s.trim().replace("#", ""); if (s.length === 3) s = s.replace(/./g, "$&$&"); const n = parseInt(s, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const readColor = () => { try { color = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--cool")); } catch (e) {} };
  function size() {
    const r = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(70, Math.floor(w / 16));
    nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .8 }));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    const [r, g, b] = color;
    nodes.forEach(p => {
      if (!still) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.vx += dx / d * .004; p.vy += dy / d * .004; }
        p.vx *= .995; p.vy *= .995; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = `rgba(${r},${g},${b},.55)`; ctx.fill();
    });
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 120) { ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 120) * .28})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
    }
    if (running && !still) requestAnimationFrame(frame);
  }
  hero.addEventListener("mousemove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver(es => { const on = es[0].isIntersecting; if (on && !running) { running = true; requestAnimationFrame(frame); } running = on; }).observe(hero);
  addEventListener("resize", size);
  document.getElementById("theme").addEventListener("click", () => setTimeout(() => { readColor(); if (still) frame(); }, 30));
  readColor(); size(); frame();
})();