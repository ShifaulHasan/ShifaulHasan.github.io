// 1. Dark / light theme (remembered in the browser)
const root = document.documentElement;
document.getElementById("theme").addEventListener("click", () => {
  const dark = getComputedStyle(root).getPropertyValue("--paper").trim() === "#0D1B20";
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// 2. Mobile menu
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

// 3. Highlight the nav link of the section you are reading
const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

// 4. Project filter
const chips = document.querySelectorAll(".filters .chip");
const projects = document.querySelectorAll(".project");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.toggle("active", c === chip));
  projects.forEach(p => { p.hidden = chip.dataset.filter !== "all" && p.dataset.cat !== chip.dataset.filter; });
}));

// 5. Copy email
const copy = document.getElementById("copy");
copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("email").textContent);
    copy.textContent = "Copied";
  } catch (e) { copy.textContent = "Press Ctrl+C"; }
  setTimeout(() => (copy.textContent = "Copy email"), 1800);
});

// 6. Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// 7. Typing effect for the role line
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

// 8. Count-up numbers
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

// 9. Reveal on scroll
const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".pub, .project, .timeline .item, .edu-card, .cv-card, .skills, .intro, section h2").forEach(el => {
  el.classList.add("reveal"); reveal.observe(el);
});

// 10. Glow follows the mouse, photo tilts
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

// 11. Scroll progress bar and back-to-top button
const bar = document.getElementById("progress");
const topBtn = document.getElementById("top-btn");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  topBtn.classList.toggle("show", h.scrollTop > 600);
}, { passive: true });
topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// 12. Contact form: Formspree if configured, otherwise opens the visitor's email app
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
  if (d._gotcha) return;                      // spam bot caught
  const btn = form.querySelector("button");
  if (form.action.includes("YOUR_FORM_ID")) { // not set up yet: fall back to mailto
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

// 13. Copy certificate serial numbers
document.querySelectorAll(".copy-serial").forEach(btn => btn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "Copied"; }
  catch (e) { btn.textContent = "Select and copy"; }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
}));