import { supabase } from "./supabase-client.js";

const grids = {};
let lightbox;

function setMessage(grid, message, type = "info") {
  if (!grid) return;
  grid.innerHTML = `<p class="tudastar-message tudastar-message--${type}">${message}</p>`;
}

function appendText(parent, className, text) {
  if (!text) return;

  const element = document.createElement("p");
  element.className = className;
  element.textContent = text;
  parent.append(element);
}

function createBadge(text) {
  const badge = document.createElement("span");
  badge.className = "tudastar-card__badge";
  badge.textContent = text;
  return badge;
}

function getDetailUrl(item) {
  if (item.url) return item.url;
  if (item.slug) return `./cikk/?slug=${encodeURIComponent(item.slug)}`;
  if (item.id) return `./cikk/?id=${encodeURIComponent(item.id)}`;
  return "#";
}

function hasDetailUrl(item) {
  const url = getDetailUrl(item);
  return url && url !== "#";
}

function createCta(label, href) {
  const cta = document.createElement("a");
  cta.className = "tudastar-card__cta";
  cta.href = href;
  cta.textContent = label;
  return cta;
}

function appendCardImage(article, item, fallbackLabel, options = {}) {
  if (item.image_url) {
    const image = document.createElement("img");
    image.className = "tudastar-card__image";
    image.src = item.image_url;
    image.alt = item.alt_text || item.title || fallbackLabel;
    image.loading = "lazy";

    if (options.zoomable) {
      image.classList.add("is-zoomable");
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Kép megnyitása nagyobb méretben");
      image.addEventListener("click", () => openLightbox(image.src, image.alt));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image.src, image.alt);
        }
      });
    }

    article.append(image);
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "tudastar-card__image-placeholder";
  placeholder.textContent = fallbackLabel;
  article.append(placeholder);
}

function createLightbox() {
  const overlay = document.createElement("div");
  overlay.className = "tudastar-lightbox";
  overlay.hidden = true;

  const closeButton = document.createElement("button");
  closeButton.className = "tudastar-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Kép bezárása");
  closeButton.textContent = "×";

  const image = document.createElement("img");
  image.className = "tudastar-lightbox__image";
  image.alt = "";

  overlay.append(closeButton, image);
  document.body.append(overlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === closeButton) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeLightbox();
    }
  });

  return { overlay, image, closeButton };
}

function openLightbox(src, alt) {
  if (!lightbox) lightbox = createLightbox();

  lightbox.image.src = src;
  lightbox.image.alt = alt || "Tudástár kép";
  lightbox.overlay.hidden = false;
  document.body.classList.add("tudastar-lightbox-open");
  lightbox.closeButton.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.overlay.hidden = true;
  lightbox.image.removeAttribute("src");
  document.body.classList.remove("tudastar-lightbox-open");
}

function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  appendCardImage(article, post, "Szakértői cikk");

  const body = document.createElement("div");
  body.className = "tudastar-card__body";

  const badges = document.createElement("div");
  badges.className = "tudastar-card__badges";
  badges.append(createBadge(post.type || "Szakértői cikk"));
  if (post.category) badges.append(createBadge(post.category));
  body.append(badges);

  const title = document.createElement("h2");
  title.className = "tudastar-card__title";
  title.textContent = post.title || "Szakértői cikk";
  body.append(title);

  appendText(body, "tudastar-card__text", post.excerpt || post.description || post.summary);

  if (hasDetailUrl(post)) {
    body.append(createCta("Elolvasom", getDetailUrl(post)));
  }

  article.append(body);
  return article;
}

function createBeforeAfterCard(item) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  appendCardImage(article, item, "Előtte-utána eredmény", { zoomable: true });

  const body = document.createElement("div");
  body.className = "tudastar-card__body";

  const badges = document.createElement("div");
  badges.className = "tudastar-card__badges";
  badges.append(createBadge("Előtte-utána"));
  if (item.category) badges.append(createBadge(item.category));
  body.append(badges);

  const title = document.createElement("h2");
  title.className = "tudastar-card__title";
  title.textContent = item.title || "Előtte-utána eredmény";
  body.append(title);

  appendText(body, "tudastar-card__text", item.problem ? `Probléma: ${item.problem}` : "");
  appendText(body, "tudastar-card__text", item.solution ? `Megoldás: ${item.solution}` : "");
  appendText(body, "tudastar-card__result", item.result ? `Eredmény: ${item.result}` : "");
  appendText(body, "tudastar-card__service", item.related_service ? `Kapcsolódó szolgáltatás: ${item.related_service}` : "");

  article.append(body);
  return article;
}

function createReferenceCard(item) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  appendCardImage(article, item, "Referencia munka", { zoomable: true });

  const body = document.createElement("div");
  body.className = "tudastar-card__body";

  const badges = document.createElement("div");
  badges.className = "tudastar-card__badges";
  badges.append(createBadge("Referencia"));
  if (item.category) badges.append(createBadge(item.category));
  body.append(badges);

  const title = document.createElement("h2");
  title.className = "tudastar-card__title";
  title.textContent = item.title || "Referencia munka";
  body.append(title);

  appendText(body, "tudastar-card__text", item.car_type ? `Autó: ${item.car_type}` : "");
  appendText(body, "tudastar-card__text", item.problem ? `Probléma: ${item.problem}` : "");
  appendText(body, "tudastar-card__text", item.solution ? `Megoldás: ${item.solution}` : "");
  appendText(body, "tudastar-card__result", item.result ? `Eredmény: ${item.result}` : "");
  appendText(body, "tudastar-card__service", item.related_service ? `Kapcsolódó szolgáltatás: ${item.related_service}` : "");

  article.append(body);
  return article;
}

function renderItems(grid, items, createCard) {
  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.append(createCard(item)));
  grid.append(fragment);
}

async function loadPosts() {
  const grid = grids.posts;
  if (!grid) return;

  setMessage(grid, "Tudástár cikkek betöltése...");

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Posts Supabase error:", error);
    setMessage(grid, "A tudástár cikkek betöltése nem sikerült.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage(grid, "Jelenleg nincs publikált cikk.");
    return;
  }

  renderItems(grid, data, createPostCard);
}

async function loadBeforeAfter() {
  const grid = grids.beforeAfter;
  if (!grid) return;

  setMessage(grid, "Előtte-utána munkák betöltése...");

  const { data, error } = await supabase
    .from("before_after")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Before-after Supabase error:", error);
    setMessage(grid, "Az előtte-utána munkák betöltése nem sikerült.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage(grid, "Jelenleg nincs aktív előtte-utána munka.");
    return;
  }

  renderItems(grid, data, createBeforeAfterCard);
}

async function loadReferences() {
  const grid = grids.references;
  if (!grid) return;

  setMessage(grid, "Referencia munkák betöltése...");

  const { data, error } = await supabase
    .from("references")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("References Supabase error:", error);
    setMessage(grid, "A referencia munkák betöltése nem sikerült.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage(grid, "Jelenleg nincs aktív referencia munka.");
    return;
  }

  renderItems(grid, data, createReferenceCard);
}

document.addEventListener("DOMContentLoaded", () => {
  grids.posts = document.getElementById("posts-grid");
  grids.beforeAfter = document.getElementById("before-after-grid");
  grids.references = document.getElementById("references-grid");

  loadPosts();
  loadBeforeAfter();
  loadReferences();
});
