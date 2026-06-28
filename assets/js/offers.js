import { supabase } from "./supabase-client.js";

const offersGrid = document.getElementById("offers-grid");
const fallbackBookingUrl = "/foglalas/";

function setMessage(message, type = "info") {
  if (!offersGrid) return;

  offersGrid.innerHTML = `<p class="offers-message offers-message--${type}">${message}</p>`;
}

function normalizeItems(items) {
  if (Array.isArray(items)) {
    return items;
  }

  if (typeof items === "string" && items.trim()) {
    try {
      const parsedItems = JSON.parse(items);
      return Array.isArray(parsedItems) ? parsedItems : [items];
    } catch {
      return items
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeOfferText(value) {
  return (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ő/g, "o")
    .replace(/ű/g, "u");
}

function getOfferAnchor(offer) {
  const haystack = normalizeOfferText(`${offer.title || ""} ${offer.description || ""}`);

  if (haystack.includes("markaspecifikus") || haystack.includes("marka specifikus")) return "markaspecifikus-premium";
  if (haystack.includes("keramia") || haystack.includes("graphene")) return "keramia-bevonat";
  if (haystack.includes("polirozas") || haystack.includes("polir")) return "polirozas";
  if (haystack.includes("premium") && haystack.includes("kulso") && haystack.includes("belso")) return "premium-kulso-belso";

  return "";
}

function getDisplayOffer(offer) {
  const haystack = normalizeOfferText(`${offer.title || ""} ${offer.description || ""}`);
  const overrides = [
    {
      matches: () => haystack.includes("eladasra") || haystack.includes("eladas elott"),
      title: "Eladásra felkészítés csomag",
      price: "85 000 Ft",
    },
    {
      matches: () => haystack.includes("csillogas"),
      title: "Csillogás csomag",
      price: "105 000 Ft",
    },
    {
      matches: () => haystack.includes("nano vedelem"),
      title: "Nano védelem",
      price: "10 000 Ft-tól",
    },
    {
      matches: () => haystack.includes("keramia") || haystack.includes("graphene"),
      title: "Kerámia védelem",
      price: "99 000 Ft-tól",
    },
    {
      matches: () => haystack.includes("lampapolir") || haystack.includes("lampa polir"),
      title: "Lámpapolír",
      price: "25 000 Ft/pár",
    },
    {
      matches: () => haystack.includes("karpittisztitas"),
      title: "Kárpittisztítás",
      price: "49 990 Ft-tól",
    },
    {
      matches: () => haystack.includes("polirozas") || haystack.includes("polir"),
      title: "Polírozás csomag",
      price: "45 000 Ft-tól",
    },
    {
      matches: () => haystack.includes("premium") && haystack.includes("kulso") && haystack.includes("belso"),
      title: "Prémium külső-belső takarítás Nano Finish bevonattal",
      price: "16 500 Ft-tól",
    },
    {
      matches: () => haystack.includes("markaspecifikus") || haystack.includes("marka specifikus"),
      title: "Márkaspecifikus prémium csomag",
      price: "25 000 Ft-tól",
    },
    {
      matches: () => haystack.includes("klimatisztitas") || haystack.includes("klima"),
      title: "Klímatisztítás",
      price: "11 990 Ft-tól",
    },
  ];
  const override = overrides.find((item) => item.matches());

  return override ? { ...offer, ...override } : offer;
}

function createOfferCard(offer) {
  offer = getDisplayOffer(offer);
  const article = document.createElement("article");
  article.className = "offer-card";
  const anchor = getOfferAnchor(offer);
  if (anchor) {
    article.id = anchor;
  }

  if (offer.image_url) {
    const image = document.createElement("img");
    image.className = "offer-card__image";
    image.src = offer.image_url;
    image.alt = offer.title || "Tip-Top ajánlat";
    image.loading = "lazy";
    article.append(image);
  }

  const body = document.createElement("div");
  body.className = "offer-card__body";

  const title = document.createElement("h3");
  title.className = "offer-card__title";
  title.textContent = offer.title || "Ajánlat";
  body.append(title);

  if (offer.description) {
    const description = document.createElement("p");
    description.className = "offer-card__description";
    description.textContent = offer.description;
    body.append(description);
  }

  const items = normalizeItems(offer.items);
  if (items.length) {
    const list = document.createElement("ul");
    list.className = "offer-card__items";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.append(listItem);
    });

    body.append(list);
  }

  const priceWrap = document.createElement("div");
  priceWrap.className = "offer-card__price-wrap";

  const priceLabel = document.createElement("span");
  priceLabel.className = "offer-card__price-label";
  priceLabel.textContent = offer.price_label || "Ár";
  priceWrap.append(priceLabel);

  const price = document.createElement("strong");
  price.className = "offer-card__price";
  price.textContent = offer.price || "Egyedi ajánlat alapján";
  priceWrap.append(price);

  body.append(priceWrap);

  const cta = document.createElement("a");
  cta.className = "offer-card__cta";
  cta.href = offer.booking_url || fallbackBookingUrl;
  cta.textContent = offer.cta_label || "Időpontot foglalok";
  body.append(cta);

  article.append(body);
  return article;
}

function scrollToRequestedOffer() {
  const anchor = decodeURIComponent(window.location.hash || "").replace("#", "");
  if (!anchor) return;

  const target = document.getElementById(anchor);
  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function loadOffers() {
  if (!offersGrid) return;

  setMessage("Ajánlatok betöltése...");

  const { data, error } = await supabase
    .from("offers")
    .select("image_url,title,description,items,price_label,price,cta_label,booking_url,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase offers error:", error);
    setMessage("Az ajánlatok betöltése nem sikerült. Kérjük, próbáld meg később.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage("Jelenleg nincs aktív ajánlat.");
    return;
  }

  offersGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((offer) => fragment.append(createOfferCard(offer)));
  offersGrid.append(fragment);
  scrollToRequestedOffer();
}

loadOffers();
