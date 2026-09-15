(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const header = $("#header");
  window.addEventListener(
    "scroll",
    () => {
      if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  const sections = $$("section[id]");
  const navLinkEls = $$(".nav-link");
  const observerNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinkEls.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observerNav.observe(s));

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObs.observe(el));

  function animateCounter(el, target) {
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }

  const statsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const stat = entry.target;
        const target = parseInt(stat.dataset.count, 10);
        const counter = $(".counter", stat);
        if (counter && !stat.dataset.done) {
          stat.dataset.done = "1";
          animateCounter(counter, target);
        }
        statsObs.unobserve(stat);
      });
    },
    { threshold: 0.4 }
  );
  $$(".stat").forEach((s) => statsObs.observe(s));

  $$(".tl-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".tl-item");
      const body = $(".tl-body", item);
      const expanded = btn.getAttribute("aria-expanded") === "true";
      $$(".tl-item").forEach((other) => {
        if (other === item) return;
        other.classList.remove("active");
        $(".tl-trigger", other)?.setAttribute("aria-expanded", "false");
        const b = $(".tl-body", other);
        if (b) b.hidden = true;
      });
      item.classList.toggle("active", !expanded);
      btn.setAttribute("aria-expanded", String(!expanded));
      if (body) body.hidden = expanded;
    });
  });

  const copyBtn = $("#copyEmail");
  const emailText = $("#emailText");
  if (copyBtn && emailText) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(emailText.textContent.trim());
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
      } catch {
        copyBtn.textContent = "Failed";
      }
    });
  }

  const sendBtn = $("#sendEmail");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const name = $("#formName")?.value || "";
      const subject = $("#formSubject")?.value || "Coffee chat / career enablement";
      const message = $("#formMessage")?.value || "";
      const body = encodeURIComponent(`Name: ${name}\n\n${message}`);
      window.location.href = `mailto:ammarjamshed123@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  const filters = $("#projectFilters");
  const cards = $$("#projectGrid .project-card");
  if (filters && cards.length) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      $$(".filter-btn", filters).forEach((b) => b.classList.toggle("active", b === btn));
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const tags = (card.dataset.tags || "").split(/\s+/);
        card.hidden = !(filter === "all" || tags.includes(filter));
      });
    });
  }
})();
