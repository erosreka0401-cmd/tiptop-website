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
            <p>Időszakos ajánlatok, szezonális tanácsok és szakmai tartalmak. Ha érdekelnek az aktualitások, jelezd nekünk üzenetben.</p>
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
    <button class="floating-back-button" type="button" data-history-back aria-label="Vissza az előző oldalra">
      <i class="fa-solid fa-arrow-left"></i>
      <span>Vissza</span>
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

function initHistoryBackButton() {
  const button = document.querySelector("[data-history-back]");
  if (!button) return;

  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  const homePath = new URL(toRoot("index.html"), window.location.href).pathname.replace(/\/index\.html$/, "/");
  const hasSameOriginReferrer = (() => {
    if (!document.referrer) return false;
    try {
      return new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      return false;
    }
  })();

  if (currentPath === homePath) {
    button.hidden = true;
    return;
  }

  button.addEventListener("click", () => {
    if (hasSameOriginReferrer) {
      window.history.back();
      return;
    }

    window.location.href = currentPath.includes("/szolgaltatasok/") ? toRoot("szolgaltatasok/") : toRoot("index.html");
  });
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
    text: "A polírozás segít javítani a felület optikai állapotát, csökkenteni a mikrokarcokat, és újra látványosabbá tenni az autó megjelenését.",
    href: "szolgaltatasok/polirozas/",
  },
  ujauto: {
    title: "Kerámia bevonat",
    text: "Új autónál az a legnagyobb előny, hogy az állapot még most megőrizhető.",
    href: "szolgaltatasok/keramia-bevonat/",
  },
  eladas: {
    title: "Eladásra felkészítés csomag",
    text: "Állapotjavító csomag eladás előtt, amikor fontos az első benyomás, a tiszta beltér és az ápolt külső megjelenés. Tartalma: prémium wax bevonat, nedves kárpittisztítás, külső-belső takarítás, gumi- és felniápolás, ózonos klímatisztítás.",
    href: "foglalas/",
    actions: [
      { label: "Időpontot foglalok", href: "foglalas/", variant: "light" },
    ],
  },
  keramia: {
    title: "Kerámia bevonat",
    text: "Tartós védelem új, polírozott vagy jó állapotú autóra. A cél, hogy a fényezés tovább őrizze a fényét, könnyebben tisztítható maradjon, és ellenállóbb legyen a mindennapi használat során.",
    href: "szolgaltatasok/keramia-bevonat/",
  },
  kulso: {
    title: "Kíméletes külső tisztítás és felületkezelés",
    text: "Vízkő, makacs foltok vagy ráégett külső szennyeződés esetén a cél az, hogy a lerakódást úgy távolítsuk el, hogy közben ne sérüljön a fényezés és a védőréteg.",
    href: "szolgaltatasok/automosas-takaritas/",
  },
  belso: {
    title: "Kárpittisztítás és belső mélytisztítás",
    text: "Foltos, szagos, poros vagy erősen használt belső térnél az egyszerű belső takarítás sokszor már kevés. A kárpittisztítás és belső mélytisztítás nemcsak látványban javít, hanem a mindennapi komfortot is visszaadja.",
    href: "szolgaltatasok/karpittisztitas/",
  },
  klima: {
    title: "Klímatisztítás és szagtalanítás",
    text: "A kellemetlen szag forrása lehet a klímarendszer, a kárpit, a szőnyegek, a szellőzőjáratok vagy korábbi beázás is. Ezért a cél nem a szag elfedése, hanem az ok feltárása és kezelése.",
    href: "szolgaltatasok/klimatisztitas-szagtalanitas/",
  },
  tetokarpit: {
    title: "Tetőkárpit tisztítás, előzetes állapotfelméréssel",
    text: "A tetőkárpit különösen érzékeny felület. Ezért ennél a problémánál az első lépés mindig az állapotfelmérés.",
    href: "szolgaltatasok/tetokarpit-tisztitas/",
    actions: [
      { label: "Kérj ajánlatot személyesen, vagy hívj: +36 30 235 0633", href: "tel:+36302350633", variant: "light" },
      { label: "Részletek", href: "szolgaltatasok/tetokarpit-tisztitas/", variant: "outline" },
    ],
  },
  lampa: {
    title: "Lámpapolírozás / lámpafóliázás",
    text: "A lámpapolírozás javítja az átlátszóságot és az optikai állapotot. Tartósabb eredményhez a felület védelme vagy fóliázása is javasolt.",
    href: "szolgaltatasok/lampapolirozas-lampafoliazas/",
  },
  motorter: {
    title: "Motortér tisztítás",
    text: "A motortér tisztítás speciális, előzetes egyeztetést igénylő kezelés. Az alkalmazható megoldás az autó állapotától, az érzékeny alkatrészektől és a szennyezettség mértékétől függ.",
    href: "szolgaltatasok/motorter-tisztitas/",
  },
  ceges: {
    title: "Belső mélytisztítás / céges autóápolási csomag",
    text: "A céges, munkás vagy sokat használt autóknál a tisztaság mellett az első benyomás és a használhatóság is fontos. Itt gyakran nem egy gyors takarítás ad jó eredményt.",
    href: "szolgaltatasok/teherauto-munkagep-takaritas/",
  },
  serules: {
    title: "Horpadásjavítás és kavicsfelverődés javítás",
    text: "A horpadás és kavicsfelverődés pontos javíthatósága mindig a sérülés helyétől, méretétől és jellegétől függ. Az első lépés a fotóbeküldés vagy személyes állapotfelmérés.",
    href: "szolgaltatasok/horpadas-kavicsfelverodes/",
    actions: [
      { label: "Horpadás javítás | Részletek", href: "szolgaltatasok/horpadas-kavicsfelverodes/", variant: "light" },
      { label: "Időpontkérés", href: "foglalas/", variant: "outline" },
    ],
  },
  karpitserules: {
    title: "Bőr- és szövetjavítás, festés",
    text: "Kárpitsérülés, szakadás, kopás vagy belső felületi hiba esetén a javíthatóságot fotó vagy személyes állapotfelmérés alapján lehet pontosan megítélni.",
    href: "szolgaltatasok/bor-szovet-javitas/",
    actions: [
      { label: "Bőr és szövet javítás, festés | Részletek", href: "szolgaltatasok/bor-szovet-javitas/", variant: "outline" },
      { label: "Időpontkérés", href: "foglalas/", variant: "light" },
    ],
  },
};

function bindDiagnosis() {
  const result = document.querySelector("[data-diagnosis-result]");
  if (!result) return;

  const clearResult = () => {
    result.classList.remove("is-visible");
    result.innerHTML = "";
  };

  const showResult = (type) => {
    const data = diagnosisData[type];
    if (!data) return;
      const actions = data.actions || [
        { label: "Időpontfoglalás", href: "foglalas/", variant: "light" },
        { label: "Részletek", href: data.href, variant: "outline" },
      ];
      result.innerHTML = `
        <p class="section-kicker">Javaslatunk Neked</p>
        <h2 class="section-title">${data.title}</h2>
        <p class="section-copy">${data.text}</p>
        <div class="actions">
          ${actions
            .map((action) => `<a class="btn btn-${action.variant}" href="${action.href.startsWith("tel:") ? action.href : toRoot(action.href)}">${action.label}</a>`)
            .join("")}
        </div>
      `;
      result.classList.add("is-visible");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  document.querySelectorAll("[data-diagnosis]").forEach((button) => {
    button.addEventListener("click", () => showResult(button.getAttribute("data-diagnosis")));
  });

  document.querySelectorAll(".diagnosis-accordion").forEach((accordion) => {
    const summary = accordion.querySelector("summary");
    summary?.addEventListener("click", () => {
      if (accordion.open) clearResult();
    });

    accordion.addEventListener("toggle", () => {
      if (!accordion.open) clearResult();
    });
  });

  const initialProblem = new URLSearchParams(window.location.search).get("problem");
  if (initialProblem) {
    window.setTimeout(() => showResult(initialProblem), 120);
  }
}

function bindServiceGroups() {
  const groups = document.querySelectorAll("[data-service-groups] .service-group");
  if (!groups.length) return;

  groups.forEach((group) => {
    const summary = group.querySelector("summary");
    summary?.addEventListener("click", (event) => {
      event.preventDefault();

      if (group.open) {
        group.open = false;
        return;
      }

      groups.forEach((otherGroup) => {
        if (otherGroup !== group) otherGroup.open = false;
      });

      group.open = true;
      window.requestAnimationFrame(() => {
        group.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
}

const priceCategories = [
  ["wash", "Autómosás és beltérápolás"],
  ["upholstery", "Kárpittisztítás"],
  ["climate", "Klíma és szagtalanítás"],
  ["polish", "Polírozás"],
  ["ceramic", "Kerámia bevonat"],
  ["lights", "Lámpapolírozás és lámpafóliázás"],
  ["engine", "Motortér tisztítás"],
  ["repair", "Bőr és szövetjavítás"],
  ["dent", "Horpadásjavítás"],
  ["fleet", "Nagyobb járművek és céges igények"],
  ["carpet", "Szőnyegtisztítás"],
];

const priceSizeMeta = {
  all: { label: "Minden méret", icon: "fa-layer-group" },
  brand: { label: "BMW, AUDI, MERCEDES, VW márkaspecifikus", icon: "fa-star" },
  city: { label: "Városi cirkáló", icon: "fa-car-side" },
  car: { label: "Személyautó, SUV, Egyterű", icon: "fa-car" },
  offroad: { label: "Terepjáró", icon: "fa-truck-monster" },
  van: { label: "Kisbusz, Tgk, Pick Up", icon: "fa-van-shuttle" },
};

function normalizePriceSize(size) {
  if (size === "Személygépkocsi") return "brand";
  if (size === "Városi cirkáló") return "city";
  if (size === "Személyautó / SUV" || size === "Személyautó / SUV / egyterű") return "car";
  if (size === "Terepjáró" || size === "Városi terepjáró") return "offroad";
  if (size === "Kisbusz / TGK" || size === "Kisbusz / TGK / Pick Up") return "van";
  return "other";
}

const priceCatalog = [
  { category: "wash", title: "AUDI prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000, sizeLabel: "AUDI márkaspecifikus" },
  { category: "wash", title: "BMW prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000, sizeLabel: "BMW márkaspecifikus" },
  { category: "wash", title: "MERCEDES prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000, sizeLabel: "MERCEDES márkaspecifikus" },
  { category: "wash", title: "VOLKSWAGEN prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000, sizeLabel: "VW márkaspecifikus" },
  { category: "wash", title: "Külső mosás", size: "Városi cirkáló", price: 7500 },
  { category: "wash", title: "Belső takarítás", size: "Városi cirkáló", price: 8000 },
  { category: "wash", title: "Külső + belső takarítás", size: "Városi cirkáló", price: 15500 },
  { category: "wash", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Városi cirkáló", price: 16500 },
  { category: "wash", title: "Külső mosás", size: "Személyautó / SUV / egyterű", price: 8500 },
  { category: "wash", title: "Belső takarítás", size: "Személyautó / SUV / egyterű", price: 9000 },
  { category: "wash", title: "Külső + belső takarítás", size: "Személyautó / SUV / egyterű", price: 17500 },
  { category: "wash", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Személyautó / SUV / egyterű", price: 18500 },
  { category: "wash", title: "Prémium külső mosás Nano Finish bevonattal", size: "Városi terepjáró", price: 10000 },
  { category: "wash", title: "Belső takarítás", size: "Városi terepjáró", price: 10000 },
  { category: "wash", title: "Külső + belső takarítás", size: "Városi terepjáró", price: 20000 },
  { category: "wash", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Városi terepjáró", price: 21000 },
  { category: "wash", title: "Külső mosás", size: "Kisbusz / TGK / Pick Up", price: 12000 },
  { category: "wash", title: "Belső takarítás", size: "Kisbusz / TGK / Pick Up", price: 12000 },
  { category: "wash", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Kisbusz / TGK / Pick Up", price: 27000 },
  { category: "upholstery", title: "Normál kárpittisztítás", size: "Városi cirkáló", price: 49990 },
  { category: "upholstery", title: "Normál kárpittisztítás", size: "Személyautó / SUV", price: 54990 },
  { category: "upholstery", title: "Normál kárpittisztítás", size: "Terepjáró", price: 59990 },
  { category: "upholstery", title: "Normál kárpittisztítás", size: "Kisbusz / TGK", price: 69990 },
  { category: "upholstery", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Városi cirkáló", price: 59990 },
  { category: "upholstery", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Személyautó / SUV", price: 64990 },
  { category: "upholstery", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Terepjáró", price: 69990 },
  { category: "upholstery", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Kisbusz / TGK", price: 79990 },
  { category: "upholstery", title: "Üléstisztítás / darab", size: "Kiegészítő", price: 7500 },
  { category: "upholstery", title: "Erős szennyeződés felár", size: "Kiegészítő", price: 5000 },
  { category: "upholstery", title: "Kisbusz kárpittisztítás, 9 személy", size: "Kisbusz / TGK", price: 65000 },
  { category: "carpet", title: "Szőnyegtisztítás / m²", size: "Szőnyeg", price: 2000 },
  { category: "carpet", title: "Szőnyegimpregnálás / m²", size: "Szőnyeg", price: 1600 },

  { category: "climate", title: "Ózonos klímatisztítás", size: "Klíma", price: 12000 },
  { category: "climate", title: "Vegyszeres klímatisztítás", size: "Klíma", price: 17900 },
  { category: "climate", title: "Klíma kombó: vegyszeres + ózonos kezelés", size: "Klíma", price: 19990 },
  { category: "climate", title: "Vegyszer + ózon + ajándék utastér-fertőtlenítés", size: "Klíma", price: 19900 },
  { category: "climate", title: "Ózonos szagtalanítás / óra", size: "Klíma", price: 10000 },
  { category: "climate", title: "Pollenszűrő csere hozott szűrővel", size: "Klíma", price: null, priceText: "Díjmentes", note: "Hozott pollenszűrő esetén" },

  { category: "polish", title: "Fényesítő polírozás", size: "Városi cirkáló", price: 45000 },
  { category: "polish", title: "Fényesítő polírozás", size: "Személyautó / SUV", price: 60000 },
  { category: "polish", title: "Fényesítő polírozás", size: "Terepjáró", price: 80000 },
  { category: "polish", title: "Fényesítő polírozás", size: "Kisbusz / TGK", price: 100000 },
  { category: "polish", title: "Kétlépcsős polírozás", size: "Városi cirkáló", price: 80000 },
  { category: "polish", title: "Kétlépcsős polírozás", size: "Személyautó / SUV", price: 100000 },
  { category: "polish", title: "Kétlépcsős polírozás", size: "Terepjáró", price: 120000 },
  { category: "polish", title: "Kétlépcsős polírozás", size: "Kisbusz / TGK", price: 140000 },
  { category: "polish", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Városi cirkáló", price: 100000 },
  { category: "polish", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Személyautó / SUV", price: 120000 },
  { category: "polish", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Terepjáró", price: 150000 },
  { category: "polish", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Kisbusz / TGK", price: 180000 },
  { category: "polish", title: "Prémium waxolás", size: "Kiegészítő", price: 25000 },
  { category: "ceramic", title: "Kerámia szélvédő bevonat", size: "Kiegészítő", price: 12000 },
  { category: "ceramic", title: "Bronz kerámia csomag", size: "Városi cirkáló", price: 99000 },
  { category: "ceramic", title: "Bronz kerámia csomag", size: "Személyautó / SUV", price: 130000 },
  { category: "ceramic", title: "Bronz kerámia csomag", size: "Terepjáró", price: 150000 },
  { category: "ceramic", title: "Bronz kerámia csomag", size: "Kisbusz / TGK", price: 180000 },
  { category: "ceramic", title: "Gold kerámia csomag", size: "Városi cirkáló", price: 230000 },
  { category: "ceramic", title: "Gold kerámia csomag", size: "Személyautó / SUV", price: 260000 },
  { category: "ceramic", title: "Gold kerámia csomag", size: "Terepjáró", price: 290000 },
  { category: "ceramic", title: "Gold kerámia csomag", size: "Kisbusz / TGK", price: 300000 },
  { category: "ceramic", title: "Graphene+ csomag", size: "Városi cirkáló", price: 280000 },
  { category: "ceramic", title: "Graphene+ csomag", size: "Személyautó / SUV", price: 320000 },
  { category: "ceramic", title: "Graphene+ csomag", size: "Terepjáró", price: 350000 },
  { category: "ceramic", title: "Graphene+ csomag", size: "Kisbusz / TGK", price: 380000 },
  { category: "ceramic", title: "Kerámia utókövető csomag", size: "Városi cirkáló", price: 45000 },
  { category: "ceramic", title: "Kerámia utókövető csomag", size: "Személyautó / SUV", price: 45000 },
  { category: "ceramic", title: "Kerámia utókövető csomag", size: "Terepjáró", price: 45000 },
  { category: "ceramic", title: "Kerámia utókövető csomag", size: "Kisbusz / TGK", price: 45000 },

  { category: "lights", title: "Lámpapolírozás kerámiával, 2 darab", size: "Lámpa", price: 25000 },
  { category: "lights", title: "Lámpafóliázás, 2 darab", size: "Lámpa", price: 40000 },
  { category: "engine", title: "Autó motortér tisztítás", size: "Motortér", price: 10000 },
  { category: "engine", title: "DSL hidrogénes motortisztítás", size: "Motortér", price: 20000 },

  { category: "fleet", title: "Teherautó belső takarítás", size: "Teherautó / munkagép", price: 35000 },
  { category: "fleet", title: "Teherautó / munkagép kárpittisztítás", size: "Teherautó / munkagép", price: 70000 },
  { category: "fleet", title: "Teherautó / munkagép polírozás", size: "Teherautó / munkagép", price: 80000 },
  { category: "fleet", title: "Kamion / munkagép kombi csomag", size: "Teherautó / munkagép", price: 120000 },
  { category: "fleet", title: "Kárpittisztítás + polírozás kombó csomag", size: "Teherautó / munkagép", price: 100000 },
  { category: "fleet", title: "Traktor kárpittisztítás + polírozás kombó csomag", size: "Teherautó / munkagép", price: 80000 },

  { category: "repair", title: "Bőr- és szövetjavítás", size: "Egyedi", price: null, note: "Egyedi egyeztetés alapján" },
  { category: "repair", title: "Bőr- és szövetfestés", size: "Egyedi", price: null, note: "Egyedi egyeztetés alapján" },
  { category: "repair", title: "Belső felületi sérülések javítása", size: "Egyedi", price: null, note: "Fotóbeküldés vagy személyes megtekintés javasolt" },
  { category: "dent", title: "Horpadásjavítás", size: "Egyedi", price: null, note: "Egyedi állapotfelmérés alapján" },
  { category: "dent", title: "Kavicsfelverődés / külső sérülés kezelése", size: "Egyedi", price: null, note: "Egyedi állapotfelmérés alapján" },
];

const crossSellCatalog = [
  { id: "leather-care-normal", category: "addon", title: "Bőrápolás - normál", size: "Kiegészítő", price: 4500, note: "Külső-belső takarítás mellé" },
  { id: "leather-care-premium", category: "addon", title: "Bőrápolás - prémium", size: "Kiegészítő", price: 6500, note: "Külső-belső takarítás mellé" },
  { id: "nano-windshield", category: "addon", title: "Nano szélvédő kezelés", size: "Kiegészítő", price: 10000 },
  { id: "nano-all-glass", category: "addon", title: "Nano üvegkezelés - összes üvegfelület", size: "Kiegészítő", price: 20000 },
  { id: "climate-ozone-30", category: "addon", title: "Ózonos belsőtér tisztítás", size: "Kiegészítő", price: 10000, priceText: "10 000 Ft/óra" },
  { id: "dog-hair-fee", category: "addon", title: "Kutyaszőr felár", size: "Kiegészítő", price: 5000, priceText: "5 000 Ft-tól" },
  { id: "engine-cleaning-addon", category: "addon", title: "Motortér tisztítás", size: "Kiegészítő", price: 10000 },
  { id: "fabric-protection", category: "addon", title: "Szövetimpregnálás", size: "Kiegészítő", price: 15000 },
  { id: "front-seat-cleaning", category: "addon", title: "Üléstisztítás külön - 2 első ülés", size: "Kiegészítő", price: 15000, note: "7 500 Ft / db" },
  { id: "all-seat-cleaning", category: "addon", title: "Üléstisztítás külön - összes ülés", size: "Kiegészítő", price: 25000 },
  { id: "basic-ceramic-package", category: "addon", title: "Alap kerámia csomag", size: "Kiegészítő", price: null, priceText: "Kerámia csomag szerint", note: "Árlista alapján pontosítható" },
  { id: "two-step-interior-gift", category: "gift", title: "Ajándék belső takarítás", size: "Ajándék", price: 0, priceText: "Ajándék", note: "2 lépcsős polírozás mellé" },
  { id: "bronze-correction-polish", category: "addon", title: "Korrekciós polírozás Bronz csomaghoz", size: "Kiegészítő", price: 40000 },
  { id: "ceramic-follow-up-addon", category: "addon", title: "Kerámia utókövető csomag", size: "Kiegészítő", price: null, priceText: "Aktuális árlista szerint", note: "Garancia és tartós védelem fenntartásához" },
  { id: "lamp-ceramic-protection", category: "gift", title: "Kerámia védelem lámpapolírhoz", size: "Csomagtartalom", price: 0, priceText: "Csomagban", note: "Lámpapolír csomagban" },
  { id: "lamp-film-pair", category: "addon", title: "Lámpafóliázás", size: "Kiegészítő", price: 40000, note: "Pár" },
  { id: "pollen-filter-change", category: "addon", title: "Pollenszűrő csere", size: "Kiegészítő", price: 0, priceText: "Díjmentes", note: "Hozott pollenszűrő esetén" },
  { id: "interior-cleaning-by-size", category: "addon", title: "Belső takarítás", size: "Kiegészítő", price: null, priceText: "Járműméret szerint", note: "Árlista alapján" },
  { id: "upholstery-by-size", category: "addon", title: "Kárpittisztítás", size: "Kiegészítő", price: null, priceText: "Kárpittisztítási árlista szerint" },
  { id: "ozone-deodorizing-addon", category: "addon", title: "Ózonos szagtalanítás", size: "Kiegészítő", price: 10000, priceText: "10 000 Ft/óra" },
  { id: "wash-by-size", category: "addon", title: "Külső-belső takarítás", size: "Kiegészítő", price: null, priceText: "Járműméret szerint", note: "Árlista alapján" },
  { id: "polish-by-size", category: "addon", title: "Polírozás", size: "Kiegészítő", price: null, priceText: "Járműméret szerint", note: "Árlista alapján" },
  { id: "fleet-combo", category: "addon", title: "Kárpittisztítás + polírozás kombó", size: "Kiegészítő", price: 100000 },
  { id: "tractor-combo", category: "addon", title: "Traktor kárpittisztítás + polírozás kombó", size: "Kiegészítő", price: 80000 },
  { id: "fleet-engine-cleaning", category: "addon", title: "Motortér tisztítás nagyobb járműre", size: "Kiegészítő", price: 10000, priceText: "10 000 Ft-tól", note: "Egyeztetéssel" },
  { id: "fleet-company-offer", category: "addon", title: "Céges ajánlat", size: "Egyedi", price: null, priceText: "Egyedi ajánlat", note: "Több jármű vagy rendszeres igény esetén" },
];

const isExteriorInteriorCleaning = (item) => {
  const title = item.title.toLowerCase();
  return item.category === "wash" && (title.includes("külső-belső") || title.includes("külső + belső"));
};

const crossSellRules = [
  {
    when: isExteriorInteriorCleaning,
    offers: ["leather-care-normal", "leather-care-premium", "nano-windshield", "nano-all-glass", "climate-ozone-30"],
  },
  {
    when: (item) => item.category === "upholstery" && item.title.toLowerCase().includes("kárpittisztítás"),
    offers: ["dog-hair-fee", "engine-cleaning-addon", "nano-windshield", "fabric-protection", "front-seat-cleaning", "all-seat-cleaning"],
  },
  {
    when: (item) => item.category === "polish",
    offers: ["engine-cleaning-addon", "nano-windshield", "basic-ceramic-package"],
  },
  {
    when: (item) => item.category === "polish" && item.title.toLowerCase().includes("kétlépcsős"),
    offers: ["two-step-interior-gift"],
  },
  {
    when: (item) => item.category === "ceramic",
    offers: ["ceramic-follow-up-addon", "nano-windshield", "nano-all-glass", "fabric-protection"],
  },
  {
    when: (item) => item.category === "ceramic" && item.title.toLowerCase().includes("bronz"),
    offers: ["bronze-correction-polish"],
  },
  {
    when: (item) => item.category === "lights",
    offers: ["lamp-ceramic-protection", "lamp-film-pair", "nano-windshield"],
  },
  {
    when: (item) => item.category === "climate",
    offers: ["pollen-filter-change", "interior-cleaning-by-size", "upholstery-by-size", "ozone-deodorizing-addon"],
  },
  {
    when: (item) => item.category === "engine",
    offers: ["wash-by-size", "polish-by-size", "upholstery-by-size"],
  },
  {
    when: (item) => item.category === "fleet",
    offers: ["fleet-combo", "tractor-combo", "fleet-engine-cleaning", "fleet-company-offer"],
  },
];

const priceDescriptions = {
  "Külső mosás": "külső mosás, öblítés, szárazra törlés",
  "Belső takarítás": "porszívózás, műanyagápolás, üvegtisztítás",
  "Külső + belső takarítás": "külső mosás, porszívózás, műanyagápolás, üvegtisztítás",
  "Prémium külső-belső takarítás Nano Finish bevonattal": "külső-belső takarítás, Nano Finish bevonat",
  "Prémium külső mosás Nano Finish bevonattal": "külső mosás, Nano Finish vízlepergető bevonat",
  "AUDI prémium külső-belső takarítás": "külső-belső prémium takarítás márkaspecifikus csomagban",
  "BMW prémium külső-belső takarítás": "külső-belső prémium takarítás márkaspecifikus csomagban",
  "MERCEDES prémium külső-belső takarítás": "külső-belső prémium takarítás márkaspecifikus csomagban",
  "VOLKSWAGEN prémium külső-belső takarítás": "külső-belső prémium takarítás márkaspecifikus csomagban",
  "Prémium waxolás": "fényezésápolás, wax védelem",
  "Kerámia szélvédő bevonat": "szélvédő bevonat, vízlepergető hatás",
  "Autó motortér tisztítás": "motortér tisztítás",
  "Erős szennyeződés felár": "erős szennyezettség többletkezelése",
  "Normál kárpittisztítás": "kárpittisztítás, belső textilfelületek tisztítása",
  "Prémium kárpittisztítás szövetvédelemmel": "kárpittisztítás, szövetvédelem",
  "Üléstisztítás / darab": "egy ülés tisztítása",
  "Kisbusz kárpittisztítás, 9 személy": "kisbusz ülések és belső kárpit tisztítása",
  "Klíma Kombó, vegyszeres + ózonos beltér": "vegyszeres klímatisztítás, ózonos beltérkezelés",
  "Klímatisztítás Kombó, ózon + beltér fertőtlenítés": "ózonos kezelés, beltérfertőtlenítés",
  "Vegyszer + ózon, ajándék ózonos utastér-fertőtlenítéssel": "vegyszeres kezelés, ózonos kezelés, utastér-fertőtlenítés",
  "Ózonos klímatisztítás": "ózonos klímakezelés",
  "Ózonos szagtalanítás / óra": "ózonos szagtalanítás",
  "Vegyszeres klímatisztítás / klíma kombó": "vegyszeres klímatisztítás",
  "Vegyszeres klímatisztítás": "vegyszeres klímatisztítás",
  "Klíma kombó: vegyszeres + ózonos kezelés": "vegyszeres klímatisztítás, ózonos beltérkezelés",
  "Vegyszer + ózon + ajándék utastér-fertőtlenítés": "vegyszeres kezelés, ózonos kezelés, utastér-fertőtlenítés",
  "Hozott pollenszűrő cseréje": "pollenszűrő csere hozott szűrővel",
  "Pollenszűrő csere hozott szűrővel": "pollenszűrő csere hozott szűrővel",
  "Fényesítő polírozás": "egylépcsős polírozás, wax védelem",
  "Kétlépcsős polírozás": "kétlépcsős polírozás, prémium wax védelem",
  "PolishAngel 3-5 lépcsős prémium polírozás": "3-5 lépcsős polírozás, hibrid wax védelem",
  "Bronz kerámia csomag": "karosszéria kerámia bevonat, üvegfelület védelem",
  "Gold kerámia csomag": "öngyógyuló kerámia, karosszéria, üveg, felni, bőrápolás",
  "Graphene+ csomag": "Graphene+ bevonat, tartós felületvédelem",
  "Kerámia utókövető csomag": "kerámia bevonat éves utókezelése",
  "Lámpapolírozás kerámiával, 2 darab": "lámpacsiszolás, polírozás, kerámia védelem",
  "Lámpafóliázás, 2 darab": "lámpacsiszolás, polírozás, védőfólia",
  "DSL hidrogénes motortisztítás": "hidrogénes motortisztítás",
  "Teherautó belső takarítás": "belső takarítás nagyobb járműre",
  "Teherautó / munkagép kárpittisztítás": "kárpittisztítás nagyobb járműre",
  "Teherautó / munkagép polírozás": "külső polírozás nagyobb járműre",
  "Kamion / munkagép kombi csomag": "belső takarítás, kárpittisztítás, polírozás",
  "Kárpittisztítás + polírozás kombó csomag": "kárpittisztítás, polírozás",
  "Traktor kárpittisztítás + polírozás kombó csomag": "traktor kárpittisztítás, polírozás",
  "Szőnyegtisztítás / m²": "szőnyegtisztítás",
  "Szőnyegimpregnálás / m²": "szőnyegimpregnálás",
  "Bőr- és szövetjavítás": "bőrjavítás, szövetjavítás",
  "Bőr- és szövetfestés": "bőr- és szövetfelületek festése",
  "Belső felületi sérülések javítása": "belső felületi hibák javítása",
  "Horpadásjavítás": "horpadás javítása állapotfelmérés alapján",
  "Kavicsfelverődés / külső sérülés kezelése": "kavicsfelverődés, külső sérülés kezelése",
  "Bőrápolás - normál": "belső bőrfelületek alap ápolása",
  "Bőrápolás - prémium": "belső bőrfelületek prémium ápolása",
  "Nano szélvédő kezelés": "vízlepergető nano bevonat szélvédőre",
  "Nano üvegkezelés - összes üvegfelület": "vízlepergető nano bevonat minden üvegfelületre",
  "Ózonos belsőtér tisztítás": "ózonos belsőtér tisztítás",
  "Kutyaszőr felár": "kárpittisztításnál extra szőrmentesítési munka",
  "Motortér tisztítás": "esztétikai motortér tisztítás",
  "Szövetimpregnálás": "foltmegelőző szövetvédelem",
  "Üléstisztítás külön - 2 első ülés": "két első ülés külön tisztítása",
  "Üléstisztítás külön - összes ülés": "összes ülés külön tisztítása",
  "Alap kerámia csomag": "kerámia védelem a választott csomag szerint",
  "Ajándék belső takarítás": "2 lépcsős polírozás mellé kommunikálható ajándék",
  "Korrekciós polírozás Bronz csomaghoz": "előkészítő korrekciós polírozás Bronz kerámia előtt",
  "Kerámia utókövető csomag": "utókezelés a garancia és a tartós védelem fenntartásához",
  "Kerámia védelem lámpapolírhoz": "lámpapolír csomagban kommunikálható védelem",
  "Lámpafóliázás": "védőfólia párban, a tartósabb lámpavédelemhez",
  "Pollenszűrő csere": "hozott pollenszűrő esetén díjmentes csere",
  "Céges ajánlat": "több jármű vagy rendszeres igény esetén külön ajánlat",
};

function formatPrice(price) {
  if (price === null) return "Egyedi";
  return `${price.toLocaleString("hu-HU")} Ft`;
}

function getPriceText(item) {
  return item.priceText || formatPrice(item.price);
}

function bindPriceCalculator() {
  const root = document.querySelector("[data-price-calculator]");
  if (!root) return;

  const categorySelect = root.querySelector("[data-price-category-select]");
  const listRoot = root.querySelector("[data-price-list]");
  const sizeSelect = root.querySelector("[data-price-size]");
  const sizeFilter = sizeSelect?.closest(".price-size-filter");
  const sizeIcon = root.querySelector("[data-price-size-icon] i");
  const selectedRoot = root.querySelector("[data-selected-list]");
  const totalRoot = root.querySelector("[data-selected-total]");
  const clearButton = root.querySelector("[data-selected-clear]");
  const bookingButton = root.querySelector("[data-selected-booking]");
  let activeCategory = priceCategories[0][0];
  let selected = [];

  const getItemId = (item) => item.id || `${item.category}|${item.title}|${item.size}|${item.price ?? "custom"}`;

  try {
    const storedSelection = JSON.parse(localStorage.getItem("tiptopSelectedServices") || "[]");
    if (Array.isArray(storedSelection)) selected = storedSelection;
  } catch (error) {
    selected = [];
  }

  const preferredCategory = localStorage.getItem("tiptopPreferredPriceCategory");
  if (priceCategories.some(([id]) => id === preferredCategory)) {
    activeCategory = preferredCategory;
    localStorage.removeItem("tiptopPreferredPriceCategory");
  }

  const pendingTitle = localStorage.getItem("tiptopPendingPriceTitle");
  const pendingCategory = localStorage.getItem("tiptopPendingPriceCategory");
  let pendingSizeSelection = pendingTitle && pendingCategory ? { title: pendingTitle, category: pendingCategory } : null;
  let sizeHintRequested = localStorage.getItem("tiptopPriceSizeHint") === "true";
  localStorage.removeItem("tiptopPriceSizeHint");
  const trackedTitle = localStorage.getItem("tiptopTrackedSizeTitle");
  const trackedCategory = localStorage.getItem("tiptopTrackedSizeCategory");
  let trackedSizeSelection = trackedTitle && trackedCategory ? { title: trackedTitle, category: trackedCategory } : null;
  if (pendingCategory && priceCategories.some(([id]) => id === pendingCategory)) {
    activeCategory = pendingCategory;
  } else if (trackedCategory && priceCategories.some(([id]) => id === trackedCategory)) {
    activeCategory = trackedCategory;
  }

  const saveSelection = () => {
    localStorage.setItem("tiptopSelectedServices", JSON.stringify(selected));
    if (bookingButton) bookingButton.href = toRoot("foglalas/");
  };

  const getSizeLabel = (item) => {
    if (item.sizeLabel) return item.sizeLabel;
    if (item.category === "addon") return "Ajánlott kiegészítő";
    if (item.category === "gift") return item.size;
    if (item.category === "carpet") return "m² alapú szolgáltatás";
    if (item.category === "repair" || item.category === "dent") return "Állapotfelmérés alapján";
    if (["climate", "lights", "engine"].includes(item.category)) return "Fix díjas szolgáltatás";
    return priceSizeMeta[normalizePriceSize(item.size)]?.label || item.size;
  };

  const getDescription = (item) => priceDescriptions[item.title] || "";

  const getRecommendations = () => {
    const recommendedIds = selected.flatMap((item) =>
      crossSellRules
        .filter((rule) => rule.when(item))
        .flatMap((rule) => rule.offers)
    );
    const uniqueIds = [...new Set(recommendedIds)];

    return uniqueIds
      .map((id) => crossSellCatalog.find((item) => item.id === id))
      .filter(Boolean)
      .filter((item) => !selected.some((selectedItem) => getItemId(selectedItem) === getItemId(item)));
  };

  const renderRecommendations = () => {
    const recommendations = getRecommendations();
    if (!recommendations.length) return "";

    return `
      <div class="cross-sell-panel">
        <div class="cross-sell-head">
          <span class="section-kicker">Ajánlott mellé</span>
          <strong>Gyakran kérik hozzá</strong>
        </div>
        <div class="cross-sell-list">
          ${recommendations
            .map((item) => `
              <article class="cross-sell-item ${item.category === "gift" ? "is-gift" : ""}">
                <div>
                  <h3>${item.title}</h3>
                  ${getDescription(item) ? `<p>${getDescription(item)}</p>` : ""}
                  ${item.note ? `<small>${item.note}</small>` : ""}
                </div>
                <strong>${getPriceText(item)}</strong>
                <button type="button" data-recommendation-add="${item.id}">${item.category === "gift" ? "Hozzáadom" : "Hozzáadom"}</button>
              </article>
            `)
            .join("")}
        </div>
      </div>
    `;
  };

  const updateSizeIcon = () => {
    if (!sizeIcon) return;
    const meta = priceSizeMeta[sizeSelect.value] || priceSizeMeta.all;
    sizeIcon.className = `fa-solid ${meta.icon}`;
  };

  const renderSelected = () => {
    if (!selected.length) {
      selectedRoot.innerHTML = `<p class="selected-empty">Még nincs kiválasztott szolgáltatás.</p>`;
    } else {
      selectedRoot.innerHTML = `
        ${selected
          .map((item, index) => `
            <div class="selected-item">
              <span>
                <strong>${item.title}</strong>
                <small>${getSizeLabel(item)}${item.note ? ` · ${item.note}` : ""}</small>
              </span>
              <button type="button" data-remove-selected="${index}" aria-label="Kiválasztás törlése"><i class="fa-solid fa-xmark"></i></button>
              <b>${getPriceText(item)}</b>
            </div>
          `)
          .join("")}
        ${renderRecommendations()}
      `;
    }

    const total = selected.reduce((sum, item) => sum + (item.price || 0), 0);
    totalRoot.textContent = formatPrice(total);
    saveSelection();
  };

  const renderItems = () => {
    const size = sizeSelect.value;
    const filtered = priceCatalog.filter((item) => {
      const categoryMatch = item.category === activeCategory;
      const sizeKey = normalizePriceSize(item.size);
      const isFixedOrCustom = sizeKey === "other";
      const sizeMatch = size === "all" || sizeKey === size || isFixedOrCustom;
      return categoryMatch && sizeMatch;
    });

    listRoot.innerHTML = filtered.length
      ? filtered
          .map((item) => {
            const isSelected = selected.some((selectedItem) => getItemId(selectedItem) === getItemId(item));
            return `
              <article class="price-option ${isSelected ? "is-selected" : ""}">
                <div>
                  <h3>${item.title}</h3>
                  ${getDescription(item) ? `<p class="price-option-description">${getDescription(item)}</p>` : ""}
                </div>
                <strong>${getPriceText(item)}</strong>
                <button type="button" data-price-add="${getItemId(item)}">${isSelected ? "Kiválasztva" : "Kiválasztom"}</button>
              </article>
            `;
          })
          .join("")
      : `<p class="selected-empty">Ehhez a szűréshez nincs megjeleníthető tétel.</p>`;
  };

  const renderCategories = () => {
    categorySelect.innerHTML = priceCategories
      .map(([id, label]) => `<option value="${id}">${label}</option>`)
      .join("");
    categorySelect.value = activeCategory;
  };

  const clearPendingSizeSelection = () => {
    pendingSizeSelection = null;
    localStorage.removeItem("tiptopPendingPriceTitle");
    localStorage.removeItem("tiptopPendingPriceCategory");
    sizeFilter?.classList.remove("is-attention");
    root.querySelector("[data-size-prompt]")?.remove();
  };

  const addPendingSizeSelection = () => {
    if (!pendingSizeSelection || sizeSelect.value === "all") return false;
    const item = priceCatalog.find((catalogItem) =>
      catalogItem.category === pendingSizeSelection.category &&
      catalogItem.title === pendingSizeSelection.title &&
      normalizePriceSize(catalogItem.size) === sizeSelect.value
    );
    if (!item) return false;

    selected = selected
      .filter((selectedItem) => !(selectedItem.category === pendingSizeSelection.category && selectedItem.title === pendingSizeSelection.title))
      .concat(item);
    trackedSizeSelection = { ...pendingSizeSelection };
    localStorage.setItem("tiptopTrackedSizeTitle", pendingSizeSelection.title);
    localStorage.setItem("tiptopTrackedSizeCategory", pendingSizeSelection.category);
    clearPendingSizeSelection();
    renderItems();
    renderSelected();
    window.requestAnimationFrame(() => {
      root.querySelector(".selected-services")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return true;
  };

  const updateTrackedSizeSelection = () => {
    if (!trackedSizeSelection || pendingSizeSelection || sizeSelect.value === "all") return false;
    const hasTrackedSelection = selected.some((selectedItem) =>
      selectedItem.category === trackedSizeSelection.category &&
      selectedItem.title === trackedSizeSelection.title
    );
    if (!hasTrackedSelection) {
      trackedSizeSelection = null;
      localStorage.removeItem("tiptopTrackedSizeTitle");
      localStorage.removeItem("tiptopTrackedSizeCategory");
      return false;
    }

    const item = priceCatalog.find((catalogItem) =>
      catalogItem.category === trackedSizeSelection.category &&
      catalogItem.title === trackedSizeSelection.title &&
      normalizePriceSize(catalogItem.size) === sizeSelect.value
    );
    if (!item) return false;

    selected = selected.map((selectedItem) =>
      selectedItem.category === trackedSizeSelection.category && selectedItem.title === trackedSizeSelection.title
        ? item
        : selectedItem
    );
    renderItems();
    renderSelected();
    return true;
  };

  const renderPendingSizePrompt = () => {
    if (!pendingSizeSelection && !sizeHintRequested) return;
    sizeFilter?.classList.add("is-attention");
    if (!root.querySelector("[data-size-prompt]")) {
      sizeFilter?.insertAdjacentHTML("beforeend", `<p class="price-size-prompt" data-size-prompt>Válassz autó méretet, mert ennél a szolgáltatásnál méret szerint változik az ár.</p>`);
    }
    if (!pendingSizeSelection || !addPendingSizeSelection()) {
      window.requestAnimationFrame(() => {
        sizeFilter?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  categorySelect.addEventListener("change", () => {
    activeCategory = categorySelect.value;
    renderItems();
  });

  listRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-price-add]");
    if (!button) return;
    const item = priceCatalog.find((catalogItem) => getItemId(catalogItem) === button.getAttribute("data-price-add"));
    if (!item) return;
    const exists = selected.some((selectedItem) => getItemId(selectedItem) === getItemId(item));
    selected = exists ? selected.filter((selectedItem) => getItemId(selectedItem) !== getItemId(item)) : [...selected, item];
    renderItems();
    renderSelected();
  });

  selectedRoot.addEventListener("click", (event) => {
    const recommendationButton = event.target.closest("[data-recommendation-add]");
    if (recommendationButton) {
      const item = crossSellCatalog.find((catalogItem) => catalogItem.id === recommendationButton.getAttribute("data-recommendation-add"));
      if (!item) return;
      selected = [...selected, item];
      renderItems();
      renderSelected();
      return;
    }

    const button = event.target.closest("[data-remove-selected]");
    if (!button) return;
    const removedItem = selected[Number(button.getAttribute("data-remove-selected"))];
    selected = selected.filter((_, index) => index !== Number(button.getAttribute("data-remove-selected")));
    if (
      trackedSizeSelection &&
      removedItem?.category === trackedSizeSelection.category &&
      removedItem?.title === trackedSizeSelection.title
    ) {
      trackedSizeSelection = null;
      localStorage.removeItem("tiptopTrackedSizeTitle");
      localStorage.removeItem("tiptopTrackedSizeCategory");
    }
    renderItems();
    renderSelected();
  });

  clearButton?.addEventListener("click", () => {
    selected = [];
    trackedSizeSelection = null;
    localStorage.removeItem("tiptopTrackedSizeTitle");
    localStorage.removeItem("tiptopTrackedSizeCategory");
    renderItems();
    renderSelected();
  });

  sizeSelect.addEventListener("change", () => {
    updateSizeIcon();
    if (sizeHintRequested && !pendingSizeSelection) {
      sizeHintRequested = false;
      sizeFilter?.classList.remove("is-attention");
      root.querySelector("[data-size-prompt]")?.remove();
    }
    if (pendingSizeSelection && addPendingSizeSelection()) return;
    if (updateTrackedSizeSelection()) return;
    renderItems();
  });
  renderCategories();
  updateSizeIcon();
  renderItems();
  renderSelected();
  renderPendingSizePrompt();

  if (localStorage.getItem("tiptopScrollToSelected") === "true") {
    localStorage.removeItem("tiptopScrollToSelected");
    if (!pendingSizeSelection) {
      window.requestAnimationFrame(() => {
        root.querySelector(".selected-services")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
}

function bindPriceSelectionLinks() {
  document.querySelectorAll("[data-price-group-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const category = link.getAttribute("data-price-group-link");
      if (!category) return;
      localStorage.setItem("tiptopPreferredPriceCategory", category);
      if (link.getAttribute("data-price-size-hint") === "true") {
        localStorage.setItem("tiptopPriceSizeHint", "true");
      }
    });
  });

  document.querySelectorAll("[data-price-select-title]").forEach((link) => {
    link.addEventListener("click", () => {
      const title = link.getAttribute("data-price-select-title");
      const mode = link.getAttribute("data-price-select-mode");
      const category = link.getAttribute("data-price-select-category");
      if (mode === "size") {
        localStorage.setItem("tiptopPendingPriceTitle", title);
        localStorage.setItem("tiptopPendingPriceCategory", category || "");
        localStorage.setItem("tiptopPreferredPriceCategory", category || "");
        localStorage.removeItem("tiptopScrollToSelected");
        return;
      }

      const item = priceCatalog.find((catalogItem) => catalogItem.title === title);
      if (!item) return;

      let selected = [];
      try {
        const storedSelection = JSON.parse(localStorage.getItem("tiptopSelectedServices") || "[]");
        if (Array.isArray(storedSelection)) selected = storedSelection;
      } catch (error) {
        selected = [];
      }

      const getItemId = (service) => service.id || `${service.category}|${service.title}|${service.size}|${service.price ?? "custom"}`;
      if (!selected.some((selectedItem) => getItemId(selectedItem) === getItemId(item))) {
        localStorage.setItem("tiptopSelectedServices", JSON.stringify([...selected, item]));
      }
      localStorage.setItem("tiptopPreferredPriceCategory", item.category);
      localStorage.setItem("tiptopScrollToSelected", "true");
    });
  });
}

function initDesktopOpenDetails() {
  const detailsBlocks = document.querySelectorAll("[data-desktop-open]");
  if (!detailsBlocks.length) return;

  const syncOpenState = () => {
    const isDesktop = window.matchMedia("(min-width: 1041px)").matches;
    detailsBlocks.forEach((details) => {
      if (isDesktop) {
        details.open = true;
      } else {
        details.open = false;
      }
    });
  };

  syncOpenState();
  window.addEventListener("resize", syncOpenState);
}

function initOfferImageLightbox() {
  const offerImages = document.querySelectorAll(".offer-image.has-image img");
  if (!offerImages.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.innerHTML = `
    <button type="button" class="image-lightbox-close" aria-label="Kép bezárása"><i class="fa-solid fa-xmark"></i></button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".image-lightbox-close");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("has-open-lightbox");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  };

  offerImages.forEach((image) => {
    image.closest(".offer-image")?.setAttribute("role", "button");
    image.closest(".offer-image")?.setAttribute("tabindex", "0");
    image.closest(".offer-image")?.setAttribute("aria-label", `${image.alt || "Ajánlat képe"} nagyítása`);

    const openLightbox = () => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("has-open-lightbox");
      closeButton.focus();
    };

    image.closest(".offer-image")?.addEventListener("click", openLightbox);
    image.closest(".offer-image")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest(".image-lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  bindMenu();
  initResponsiveHero();
  initMobileCtaVisibility();
  initBackToTop();
  initHistoryBackButton();
  bindDiagnosis();
  bindServiceGroups();
  bindPriceCalculator();
  bindPriceSelectionLinks();
  initDesktopOpenDetails();
  initOfferImageLightbox();
});

