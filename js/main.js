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
    text: "A polírozás segít javítani a felület optikai állapotát, csökkenteni a mikrokarcokat, és újra látványosabbá tenni az autó megjelenését.",
    href: "szolgaltatasok/polirozas/",
  },
  ujauto: {
    title: "Kerámia bevonat",
    text: "Új autónál az a legnagyobb előny, hogy az állapot még most megőrizhető.",
    href: "szolgaltatasok/keramia-bevonat/",
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
    title: "Állapotfelmérés / sérülésjavítási ajánlat",
    text: "A horpadás, kavicsfelverődés, bőr- vagy szövetkárosodás pontos javíthatósága mindig a sérülés helyétől, méretétől és jellegétől függ. Az első lépés a fotóbeküldés vagy személyes állapotfelmérés.",
    href: "szolgaltatasok/bor-szovet-javitas/",
    actions: [
      { label: "Horpadás javítás | Hívj: +36 30 235 0633", href: "tel:+36302350633", variant: "light" },
      { label: "Bőr és szövet javítás, festés | Részletek", href: "szolgaltatasok/bor-szovet-javitas/", variant: "outline" },
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
  ["cleaning", "Tisztítás és beltérápolás"],
  ["climate", "Klíma és szagtalanítás"],
  ["paint", "Fényezés, polírozás és védelem"],
  ["special", "Optikai és speciális kezelések"],
  ["fleet", "Nagyobb járművek és céges igények"],
  ["custom", "Egyedi állapotfelméréses szolgáltatások"],
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
  { category: "cleaning", title: "AUDI prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000 },
  { category: "cleaning", title: "BMW prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000 },
  { category: "cleaning", title: "MERCEDES prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000 },
  { category: "cleaning", title: "VOLKSWAGEN prémium külső-belső takarítás", size: "Személygépkocsi", price: 25000 },
  { category: "cleaning", title: "Külső mosás", size: "Városi cirkáló", price: 7500 },
  { category: "cleaning", title: "Belső takarítás", size: "Városi cirkáló", price: 8000 },
  { category: "cleaning", title: "Külső + belső takarítás", size: "Városi cirkáló", price: 15500 },
  { category: "cleaning", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Városi cirkáló", price: 16500 },
  { category: "cleaning", title: "Külső mosás", size: "Személyautó / SUV / egyterű", price: 8500 },
  { category: "cleaning", title: "Belső takarítás", size: "Személyautó / SUV / egyterű", price: 9000 },
  { category: "cleaning", title: "Külső + belső takarítás", size: "Személyautó / SUV / egyterű", price: 17500 },
  { category: "cleaning", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Személyautó / SUV / egyterű", price: 18500 },
  { category: "cleaning", title: "Prémium külső mosás Nano Finish bevonattal", size: "Városi terepjáró", price: 10000 },
  { category: "cleaning", title: "Belső takarítás", size: "Városi terepjáró", price: 10000 },
  { category: "cleaning", title: "Külső + belső takarítás", size: "Városi terepjáró", price: 20000 },
  { category: "cleaning", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Városi terepjáró", price: 21000 },
  { category: "cleaning", title: "Külső mosás", size: "Kisbusz / TGK / Pick Up", price: 12000 },
  { category: "cleaning", title: "Belső takarítás", size: "Kisbusz / TGK / Pick Up", price: 12000 },
  { category: "cleaning", title: "Prémium külső-belső takarítás Nano Finish bevonattal", size: "Kisbusz / TGK / Pick Up", price: 27000 },
  { category: "cleaning", title: "Normál kárpittisztítás", size: "Városi cirkáló", price: 49990 },
  { category: "cleaning", title: "Normál kárpittisztítás", size: "Személyautó / SUV", price: 54990 },
  { category: "cleaning", title: "Normál kárpittisztítás", size: "Terepjáró", price: 59990 },
  { category: "cleaning", title: "Normál kárpittisztítás", size: "Kisbusz / TGK", price: 69990 },
  { category: "cleaning", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Városi cirkáló", price: 59990 },
  { category: "cleaning", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Személyautó / SUV", price: 59990 },
  { category: "cleaning", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Terepjáró", price: 69990 },
  { category: "cleaning", title: "Prémium kárpittisztítás szövetvédelemmel", size: "Kisbusz / TGK", price: 79990 },
  { category: "cleaning", title: "Üléstisztítás / darab", size: "Kiegészítő", price: 7500 },
  { category: "cleaning", title: "Erős szennyeződés felár", size: "Kiegészítő", price: 5000 },
  { category: "cleaning", title: "Kisbusz kárpittisztítás, 9 személy", size: "Kisbusz / TGK", price: 65000 },
  { category: "cleaning", title: "Szőnyegtisztítás / m²", size: "Szőnyeg", price: 2000 },
  { category: "cleaning", title: "Szőnyegimpregnálás / m²", size: "Szőnyeg", price: 1600 },

  { category: "climate", title: "Klíma Kombó, vegyszeres + ózonos beltér", size: "Klíma", price: 17900 },
  { category: "climate", title: "Klímatisztítás Kombó, ózon + beltér fertőtlenítés", size: "Klíma", price: 17900 },
  { category: "climate", title: "Vegyszer + ózon, ajándék ózonos utastér-fertőtlenítéssel", size: "Klíma", price: 19900 },
  { category: "climate", title: "Ózonos klímatisztítás", size: "Klíma", price: 12000 },
  { category: "climate", title: "Ózonos szagtalanítás / óra", size: "Klíma", price: 12000 },
  { category: "climate", title: "Vegyszeres klímatisztítás / klíma kombó", size: "Klíma", price: 17900 },
  { category: "climate", title: "Hozott pollenszűrő cseréje", size: "Klíma", price: 0, note: "Díjmentesen kérhető" },

  { category: "paint", title: "Fényesítő polírozás", size: "Városi cirkáló", price: 45000 },
  { category: "paint", title: "Fényesítő polírozás", size: "Személyautó / SUV", price: 60000 },
  { category: "paint", title: "Fényesítő polírozás", size: "Terepjáró", price: 80000 },
  { category: "paint", title: "Fényesítő polírozás", size: "Kisbusz / TGK", price: 100000 },
  { category: "paint", title: "Kétlépcsős polírozás", size: "Városi cirkáló", price: 80000 },
  { category: "paint", title: "Kétlépcsős polírozás", size: "Személyautó / SUV", price: 100000 },
  { category: "paint", title: "Kétlépcsős polírozás", size: "Terepjáró", price: 120000 },
  { category: "paint", title: "Kétlépcsős polírozás", size: "Kisbusz / TGK", price: 140000 },
  { category: "paint", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Városi cirkáló", price: 100000 },
  { category: "paint", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Személyautó / SUV", price: 120000 },
  { category: "paint", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Terepjáró", price: 150000 },
  { category: "paint", title: "PolishAngel 3-5 lépcsős prémium polírozás", size: "Kisbusz / TGK", price: 180000 },
  { category: "paint", title: "Prémium waxolás", size: "Kiegészítő", price: 25000 },
  { category: "paint", title: "Kerámia szélvédő bevonat", size: "Kiegészítő", price: 10000 },
  { category: "paint", title: "Kerámia szélvédő vízlepergető bevonat", size: "Kiegészítő", price: 12000 },
  { category: "paint", title: "Bronz kerámia csomag", size: "Városi cirkáló", price: 99000 },
  { category: "paint", title: "Bronz kerámia csomag", size: "Személyautó / SUV", price: 130000 },
  { category: "paint", title: "Bronz kerámia csomag", size: "Terepjáró", price: 150000 },
  { category: "paint", title: "Bronz kerámia csomag", size: "Kisbusz / TGK", price: 180000 },
  { category: "paint", title: "Gold kerámia csomag", size: "Városi cirkáló", price: 230000 },
  { category: "paint", title: "Gold kerámia csomag", size: "Személyautó / SUV", price: 260000 },
  { category: "paint", title: "Gold kerámia csomag", size: "Terepjáró", price: 290000 },
  { category: "paint", title: "Gold kerámia csomag", size: "Kisbusz / TGK", price: 300000 },
  { category: "paint", title: "Graphene+ csomag", size: "Városi cirkáló", price: 280000 },
  { category: "paint", title: "Graphene+ csomag", size: "Személyautó / SUV", price: 320000 },
  { category: "paint", title: "Graphene+ csomag", size: "Terepjáró", price: 350000 },
  { category: "paint", title: "Graphene+ csomag", size: "Kisbusz / TGK", price: 380000 },
  { category: "paint", title: "Kerámia utókövető csomag", size: "Kiegészítő", price: 45000 },

  { category: "special", title: "Lámpapolírozás kerámiával, 2 darab", size: "Lámpa", price: 25000 },
  { category: "special", title: "Lámpafóliázás, 2 darab", size: "Lámpa", price: 40000 },
  { category: "special", title: "Autó motormosás", size: "Motortér", price: 10000 },
  { category: "special", title: "DSL hidrogénes motortisztítás", size: "Motortér", price: 20000 },

  { category: "fleet", title: "Teherautó belső takarítás", size: "Teherautó / munkagép", price: 35000 },
  { category: "fleet", title: "Teherautó / munkagép kárpittisztítás", size: "Teherautó / munkagép", price: 70000 },
  { category: "fleet", title: "Teherautó / munkagép polírozás", size: "Teherautó / munkagép", price: 80000 },
  { category: "fleet", title: "Kamion / munkagép kombi csomag", size: "Teherautó / munkagép", price: 120000 },
  { category: "fleet", title: "Kárpittisztítás + polírozás kombó csomag", size: "Teherautó / munkagép", price: 100000 },
  { category: "fleet", title: "Traktor kárpittisztítás + polírozás kombó csomag", size: "Teherautó / munkagép", price: 80000 },

  { category: "custom", title: "Bőr- és szövetjavítás", size: "Egyedi", price: null, note: "Egyedi egyeztetés alapján" },
  { category: "custom", title: "Bőr- és szövetfestés", size: "Egyedi", price: null, note: "Egyedi egyeztetés alapján" },
  { category: "custom", title: "Belső felületi sérülések javítása", size: "Egyedi", price: null, note: "Fotóbeküldés vagy személyes megtekintés javasolt" },
  { category: "custom", title: "Horpadásjavítás", size: "Egyedi", price: null, note: "Egyedi állapotfelmérés alapján" },
  { category: "custom", title: "Kavicsfelverődés / külső sérülés kezelése", size: "Egyedi", price: null, note: "Egyedi állapotfelmérés alapján" },
];

function formatPrice(price) {
  if (price === null) return "Egyedi";
  return `${price.toLocaleString("hu-HU")} Ft`;
}

function bindPriceCalculator() {
  const root = document.querySelector("[data-price-calculator]");
  if (!root) return;

  const categoryRoot = root.querySelector("[data-price-categories]");
  const listRoot = root.querySelector("[data-price-list]");
  const sizeSelect = root.querySelector("[data-price-size]");
  const sizeIcon = root.querySelector("[data-price-size-icon] i");
  const selectedRoot = root.querySelector("[data-selected-list]");
  const totalRoot = root.querySelector("[data-selected-total]");
  const clearButton = root.querySelector("[data-selected-clear]");
  const bookingButton = root.querySelector("[data-selected-booking]");
  let activeCategory = priceCategories[0][0];
  let selected = [];

  const getItemId = (item) => `${item.category}|${item.title}|${item.size}|${item.price ?? "custom"}`;

  const saveSelection = () => {
    localStorage.setItem("tiptopSelectedServices", JSON.stringify(selected));
    if (bookingButton) bookingButton.href = toRoot("foglalas/");
  };

  const getSizeLabel = (item) => {
    return priceSizeMeta[normalizePriceSize(item.size)]?.label || item.size;
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
      selectedRoot.innerHTML = selected
        .map((item, index) => `
          <div class="selected-item">
            <span>
              <strong>${item.title}</strong>
              <small>${getSizeLabel(item)}${item.note ? ` · ${item.note}` : ""}</small>
            </span>
            <button type="button" data-remove-selected="${index}" aria-label="Kiválasztás törlése"><i class="fa-solid fa-xmark"></i></button>
            <b>${formatPrice(item.price)}</b>
          </div>
        `)
        .join("");
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
      const sizeMatch = size === "all" || sizeKey === size || sizeKey === "other";
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
                  <p>${getSizeLabel(item)}${item.note ? ` · ${item.note}` : ""}</p>
                </div>
                <strong>${formatPrice(item.price)}</strong>
                <button type="button" data-price-add="${getItemId(item)}">${isSelected ? "Kiválasztva" : "Kiválasztom"}</button>
              </article>
            `;
          })
          .join("")
      : `<p class="selected-empty">Ehhez a szűréshez nincs megjeleníthető tétel.</p>`;
  };

  const renderCategories = () => {
    categoryRoot.innerHTML = priceCategories
      .map(([id, label]) => `<button type="button" class="${id === activeCategory ? "is-active" : ""}" data-price-category="${id}">${label}</button>`)
      .join("");
  };

  categoryRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-price-category]");
    if (!button) return;
    activeCategory = button.getAttribute("data-price-category");
    renderCategories();
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
    const button = event.target.closest("[data-remove-selected]");
    if (!button) return;
    selected = selected.filter((_, index) => index !== Number(button.getAttribute("data-remove-selected")));
    renderItems();
    renderSelected();
  });

  clearButton?.addEventListener("click", () => {
    selected = [];
    renderItems();
    renderSelected();
  });

  sizeSelect.addEventListener("change", () => {
    updateSizeIcon();
    renderItems();
  });
  renderCategories();
  updateSizeIcon();
  renderItems();
  renderSelected();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  bindMenu();
  initResponsiveHero();
  initMobileCtaVisibility();
  initBackToTop();
  bindDiagnosis();
  bindServiceGroups();
  bindPriceCalculator();
});
