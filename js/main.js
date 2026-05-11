const navItems = [
  ["Kezdőlap", "index.html"],
  ["Diagnosztika", "diagnosztika/"],
  ["Szolgáltatások", "szolgaltatasok/"],
  ["Árak", "arak/"],
  ["Ajánlatok", "ajanlatok/"],
  ["Tudástár", "tudastar/"],
  ["Rólunk", "rolunk/"],
  ["Kapcsolat", "kapcsolat/"],
];

const serviceItems = [
  ["Autómosás és takarítás", "szolgaltatasok/automosas-takaritas/"],
  ["Kárpittisztítás", "szolgaltatasok/karpittisztitas/"],
  ["Polírozás", "szolgaltatasok/polirozas/"],
  ["Kerámia bevonat", "szolgaltatasok/keramia-bevonat/"],
  ["Klímatisztítás", "szolgaltatasok/klimatisztitas-szagtalanitas/"],
];

function getRootPathPrefix() {
  const script = document.currentScript || Array.from(document.scripts).find((item) => item.src.endsWith("js/main.js"));
  if (!script?.src) return "";

  const rootUrl = new URL("../", script.src);
  const currentPath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : window.location.pathname.replace(/[^/]*$/, "");
  const rootPath = rootUrl.pathname.endsWith("/") ? rootUrl.pathname : `${rootUrl.pathname}/`;
  const relativeDir = currentPath.startsWith(rootPath) ? currentPath.slice(rootPath.length) : "";
  const depth = relativeDir.split("/").filter(Boolean).length;

  return depth ? "../".repeat(depth) : "";
}

const rootPathPrefix = getRootPathPrefix();

function toRoot(href) {
  return `${rootPathPrefix}${href}`;
}

function pathIsActive(href) {
  const current = window.location.pathname.replace(/\/index\.html$/, "/");
  const target = new URL(toRoot(href), window.location.href).pathname.replace(/\/index\.html$/, "/");
  if (href === "index.html") return current === target;
  return current === target || current.startsWith(target);
}

function renderHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="${toRoot("index.html")}" aria-label="Tip-Top Autókozmetika Szekszárd kezdőlap">
          <span class="brand-mark">TT</span>
          <span>
            <span class="brand-title">TIP-TOP</span>
            <span class="brand-subtitle">Szekszárd</span>
          </span>
        </a>
        <nav class="desktop-nav" aria-label="Fő navigáció">
          ${navItems
            .map(([label, href]) => {
              const classes = [
                pathIsActive(href) ? "is-active" : "",
                label === "Diagnosztika" ? "nav-diagnosis" : "",
              ].filter(Boolean).join(" ");
              return `<a class="${classes}" href="${toRoot(href)}">${label}</a>`;
            })
            .join("")}
          <a class="nav-cta" href="${toRoot("foglalas/")}"><i class="fa-solid fa-calendar-check"></i> Időpontfoglalás</a>
        </nav>
        <button class="mobile-menu-button" type="button" data-menu-open aria-label="Menü megnyitása" aria-controls="mobile-menu" aria-expanded="false">
          <i class="fa-solid fa-bars-staggered"></i>
        </button>
      </div>
    </header>
    <div class="mobile-drawer" id="mobile-menu" data-mobile-drawer aria-hidden="true">
      <div class="drawer-backdrop" data-menu-close></div>
      <div class="drawer-panel">
        <div class="drawer-top">
          Menü
          <button class="drawer-close" type="button" data-menu-close aria-label="Menü bezárása">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav class="drawer-links" aria-label="Mobil navigáció">
          ${navItems.map(([label, href]) => `<a href="${toRoot(href)}">${label}</a>`).join("")}
          <a class="btn btn-primary" href="${toRoot("foglalas/")}">Időpontfoglalás</a>
        </nav>
      </div>
    </div>
  `;
}

function renderFooter() {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) return;

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h3>TIP-TOP</h3>
            <p>Nem az a kérdés, hogy lesznek-e karcok az autódon. Hanem az, hogy időben lépsz-e.</p>
            <div class="actions">
              <a class="btn btn-dark" href="${toRoot("kapcsolat/")}">Kapcsolat</a>
            </div>
          </div>
          <div>
            <h4>Szolgáltatások</h4>
            <ul>
              ${serviceItems.map(([label, href]) => `<li><a href="${toRoot(href)}">${label}</a></li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Kapcsolat</h4>
            <ul>
              <li>7100 Szekszárd, Pollack Mihály u. 37.</li>
              <li><a href="tel:+36305605267">+36 30 560 5267</a></li>
              <li><a href="tel:+36702765199">+36 70 276 5199</a></li>
              <li><a href="mailto:autokozmetikaszekszard@gmail.com">autokozmetikaszekszard@gmail.com</a></li>
            </ul>
          </div>
          <div>
            <h4>Hírlevél</h4>
            <p>Időszakos ajánlatok, szezonális tanácsok és szakmai tartalmak. A végleges rendszer Brevo vagy hasonló hírlevélkezelővel lesz összekötve.</p>
            <a class="btn btn-primary" href="${toRoot("kapcsolat/")}">Feliratkozási igény</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2006-2026 Tip-Top Autókozmetika Szekszárd</span>
          <span><a href="${toRoot("adatkezeles/")}">Adatkezelés</a> · <a href="${toRoot("suti-kezeles/")}">Sütikezelés</a></span>
        </div>
      </div>
    </footer>
    <div class="mobile-cta-bar">
      <a class="mobile-cta-call" href="tel:+36305605267"><i class="fa-solid fa-phone"></i> Hívás</a>
      <a class="mobile-cta-book" href="${toRoot("foglalas/")}"><i class="fa-solid fa-calendar-check"></i> Időpontfoglalás</a>
    </div>
    <button class="back-to-top" type="button" data-back-to-top aria-label="Vissza az oldal tetejére">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `;
}

function bindMenu() {
  const drawer = document.querySelector("[data-mobile-drawer]");
  const openButtons = document.querySelectorAll("[data-menu-open]");
  const closeButton = drawer?.querySelector(".drawer-close");
  let activeMenuButton = null;
  const setDrawerState = (isOpen) => {
    if (!drawer) return;

    drawer.classList.toggle("is-open", isOpen);
    drawer.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    openButtons.forEach((button) => {
      button.setAttribute("aria-expanded", String(isOpen));
    });

    if (isOpen) {
      closeButton?.focus();
    } else {
      activeMenuButton?.focus();
      activeMenuButton = null;
    }
  };
  const closeDrawer = () => setDrawerState(false);

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeMenuButton = button;
      setDrawerState(true);
    });
  });
  document.querySelectorAll("[data-menu-close]").forEach((button) => {
    button.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer-links a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}

function initMobileCtaVisibility() {
  const bar = document.querySelector(".mobile-cta-bar");
  const heroActions = document.querySelector(".hero .hero-actions");
  if (!bar) return;

  if (!heroActions) {
    const updateVisibility = () => {
      bar.classList.toggle("is-visible", window.scrollY > 240);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    bar.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle("is-visible", !entry.isIntersecting);
    },
    {
      threshold: 0.08,
    },
  );

  observer.observe(heroActions);
}

function initBackToTop() {
  const button = document.querySelector("[data-back-to-top]");
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 640);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
}

function initResponsiveHero() {
  const mediaQuery = window.matchMedia("(max-width: 720px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData;

  if (reduceMotion || saveData) return;

  document.querySelectorAll("[data-responsive-hero]").forEach((video) => {
    const setSource = () => {
      const nextSource = mediaQuery.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
      if (!nextSource || video.dataset.currentSrc === nextSource) return;

      video.dataset.currentSrc = nextSource;
      video.setAttribute("src", nextSource);
      video.load();

      const playRequest = video.play();
      if (playRequest) {
        playRequest.catch(() => {
          // Autoplay can be blocked in some browsers; the poster still keeps the hero usable.
        });
      }
    };

    setSource();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", setSource);
    } else {
      mediaQuery.addListener(setSource);
    }
  });
}

const diagnosisData = {
  karcos: {
    title: "Polírozás és fényezéskorrekció",
    text: "Matt, karcos vagy mosókarcos fényezésnél először állapotfelmérés kell, utána fényesítő, kétlépcsős vagy prémium polírozás javasolt. Tartós eredményhez kerámia védelem kapcsolható.",
    href: "szolgaltatasok/polirozas/",
  },
  ujauto: {
    title: "Új autó védelem kerámia bevonattal",
    text: "Új autónál a cél az állapot megőrzése: kíméletes előkészítés, szükség szerinti finom korrekció, majd kerámia vagy graphene védelem.",
    href: "szolgaltatasok/keramia-bevonat/",
  },
  kulso: {
    title: "Kíméletes külső tisztítás és felületkezelés",
    text: "Vízkő, makacs foltok vagy ráégett külső szennyeződés esetén a cél az, hogy a lerakódást úgy távolítsuk el, hogy közben ne sérüljön a fényezés és a védőréteg.",
    href: "szolgaltatasok/automosas-takaritas/",
  },
  belso: {
    title: "Kárpittisztítás és belső mélytisztítás",
    text: "Foltos, szagos vagy erősen használt utastérnél a kárpit, műanyagok és nehezen elérhető részek együttes kezelésére van szükség.",
    href: "szolgaltatasok/karpittisztitas/",
  },
  klima: {
    title: "Klímatisztítás és szagtalanítás",
    text: "Kellemetlen szag vagy szezonális fertőtlenítés esetén ózonos, vegyszeres vagy kombinált kezelés jöhet szóba, állapottól függően.",
    href: "szolgaltatasok/klimatisztitas-szagtalanitas/",
  },
  tetokarpit: {
    title: "Tetőkárpit tisztítás",
    text: "A tetőkárpit ragasztott, kényes felület. Itt előzetes egyeztetés és kíméletes technológia szükséges, nem általános vizes tisztítás.",
    href: "szolgaltatasok/tetokarpit-tisztitas/",
  },
  lampa: {
    title: "Lámpapolírozás és lámpafóliázás",
    text: "Bemattult lámpánál a cél nem csak a látvány, hanem a fényerő és a tartós védelem visszaállítása.",
    href: "szolgaltatasok/lampapolirozas-lampafoliazas/",
  },
  ceges: {
    title: "Teherautó, kisbusz és munkagép takarítás",
    text: "Céges vagy erősen használt járműveknél egyedi állapotfelmérés, fotóbeküldés és ütemezett takarítási ajánlat javasolt.",
    href: "szolgaltatasok/teherauto-munkagep-takaritas/",
  },
  serules: {
    title: "Bőr- és szövetjavítás vagy sérülés felmérés",
    text: "Szakadás, kopás, kavicsfelverődés vagy horpadás esetén fotó vagy személyes megtekintés alapján dönthető el a javítási irány.",
    href: "szolgaltatasok/bor-szovet-javitas/",
  },
};

function bindDiagnosis() {
  const result = document.querySelector("[data-diagnosis-result]");
  if (!result) return;

  const showResult = (type) => {
    const data = diagnosisData[type];
    if (!data) return;
      result.innerHTML = `
        <p class="section-kicker">Javaslatunk neked</p>
        <h2 class="section-title">${data.title}</h2>
        <p class="section-copy">${data.text}</p>
        <div class="actions">
          <a class="btn btn-light" href="${toRoot("foglalas/")}">Időpontot kérek</a>
          <a class="btn btn-outline" href="${toRoot(data.href)}">Részletek</a>
        </div>
      `;
      result.classList.add("is-visible");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  document.querySelectorAll("[data-diagnosis]").forEach((button) => {
    button.addEventListener("click", () => showResult(button.getAttribute("data-diagnosis")));
  });

  const initialProblem = new URLSearchParams(window.location.search).get("problem");
  if (initialProblem) {
    window.setTimeout(() => showResult(initialProblem), 120);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  bindMenu();
  initResponsiveHero();
  initMobileCtaVisibility();
  initBackToTop();
  bindDiagnosis();
});
