/* ==========================================================================
   app.js
   Small hash-router that renders pages from content.js into the DOM.
   No build step, no framework — just enough JS to make a static GitHub
   Pages site feel like a real docs app.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- icon set (nav rail + facts panel) -------------------------------- */
  const ICONS = {
    book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    shield: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    users: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    chip: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    grid: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v6"/><path d="M5 10h14l-1.5 10.5a1 1 0 0 1-1 .5H7.5a1 1 0 0 1-1-.5Z"/></svg>',
    wave: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/></svg>',
    tag: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12.59 2.59 20 10l-8 8-9-9V2h7.59Z"/><circle cx="7" cy="7" r="1"/></svg>',
    usb: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="6" r="2"/><path d="M12 8v9"/><path d="m8 13 4 4 4-4"/></svg>',
    terminal: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/></svg>',
    image: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
    list: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    cube: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m21 8-9-5-9 5v8l9 5 9-5Z"/><path d="M3.3 8.3 12 13l8.7-4.7"/><path d="M12 22V13"/></svg>',
    game: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="11" rx="4"/><path d="M8 10v5M5.5 12.5h5"/><circle cx="16" cy="10.5" r="1"/><circle cx="18.5" cy="13" r="1"/></svg>',
    hash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',
    external: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/></svg>',
    fork: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M6 8.2V12a4 4 0 0 0 4 4M18 8.2V12a4 4 0 0 0-4 4"/></svg>',
    scale: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 7 0Z"/><path d="m19 7 3 7a3.5 3.5 0 0 1-7 0Z"/></svg>',
  };

  const navEl = document.getElementById("nav");
  const docEl = document.getElementById("doc");
  const crumbTagEl = document.getElementById("crumb-tag");
  const crumbLinkEl = document.getElementById("crumb-link");
  const searchInput = document.getElementById("search-input");
  const menuBtn = document.getElementById("menu-btn");

  /* ---- build the left nav once ------------------------------------------ */
  function buildNav() {
    navEl.innerHTML = "";
    NAV.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "nav__group";

      const label = document.createElement("div");
      label.className = "nav__label";
      label.textContent = group.label.toUpperCase();
      wrap.appendChild(label);

      group.items.forEach((item) => {
        const btn = document.createElement("button");
        btn.className = "nav__item";
        btn.dataset.id = item.id;
        btn.innerHTML = `<span class="nav__icon">${ICONS[item.icon] || ""}</span><span>${item.title}</span>`;
        btn.addEventListener("click", () => {
          window.location.hash = item.id;
        });
        wrap.appendChild(btn);
      });

      navEl.appendChild(wrap);
    });
  }

  function setActiveNav(id) {
    navEl.querySelectorAll(".nav__item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.id === id);
    });
  }

  /* ---- render a page ------------------------------------------------------ */
  function renderPage(id) {
    const page = PAGES[id];
    if (!page) {
      renderNotFound(id);
      return;
    }

    document.title = `${page.title} · Flipper Zero Downloads`;

    crumbTagEl.innerHTML = `${ICONS.hash}<span>${page.tag}</span>`;
    crumbLinkEl.href = page.githubUrl || REPO_URL;

    const idx = PAGE_ORDER.indexOf(id);
    const prevId = idx > 0 ? PAGE_ORDER[idx - 1] : null;
    const nextId = idx >= 0 && idx < PAGE_ORDER.length - 1 ? PAGE_ORDER[idx + 1] : null;

    docEl.innerHTML = `
      <h1>${page.title}</h1>
      <p class="doc__lede">${page.lede}</p>
      ${page.html}
      <div class="doc-footer">
        ${prevId ? footerNav(prevId, "Previous", "prev") : "<span></span>"}
        ${nextId ? footerNav(nextId, "Next", "next") : ""}
      </div>
    `;

    setActiveNav(id);
    document.body.classList.remove("nav-open");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function footerNav(id, label, dir) {
    const p = PAGES[id];
    return `
      <div class="doc-footer__nav${dir === "next" ? " is-next" : ""}">
        <span>${label}</span>
        <a href="#${id}">${p.title}</a>
      </div>`;
  }

  function renderNotFound(id) {
    docEl.innerHTML = `
      <h1>Page not found</h1>
      <p class="doc__lede">There's no page called "${id}". Pick something from the sidebar.</p>
    `;
    crumbTagEl.innerHTML = `${ICONS.hash}<span>404</span>`;
    crumbLinkEl.href = REPO_URL;
  }

  /* ---- routing ------------------------------------------------------------ */
  function currentId() {
    const raw = window.location.hash.replace(/^#/, "");
    return raw || "about";
  }

  function route() {
    renderPage(currentId());
  }

  window.addEventListener("hashchange", route);

  /* ---- mobile nav toggle --------------------------------------------------- */
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  /* ---- simple client-side search across nav items -------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      navEl.querySelectorAll(".nav__group").forEach((group) => {
        let anyVisible = false;
        group.querySelectorAll(".nav__item").forEach((btn) => {
          const match = !q || btn.textContent.toLowerCase().includes(q);
          btn.style.display = match ? "" : "none";
          if (match) anyVisible = true;
        });
        group.style.display = anyVisible ? "" : "none";
      });
    });
  }

  /* ---- boot ----------------------------------------------------------------- */
  buildNav();
  route();
})();
