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
document.querySelectorAll(".pub, .project, .timeline .item, .edu-card, .skills, .intro, section h2").forEach(el => {
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