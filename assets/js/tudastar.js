import { supabase } from "./supabase-client.js";

const grids = {};

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
  if (item.slug) return `./${item.slug}/`;
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

function appendCardImage(article, item, fallbackLabel) {
  if (item.image_url) {
    const image = document.createElement("img");
    image.className = "tudastar-card__image";
    image.src = item.image_url;
    image.alt = item.alt_text || item.title || fallbackLabel;
    image.loading = "lazy";
    article.append(image);
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "tudastar-card__image-placeholder";
  placeholder.textContent = fallbackLabel;
  article.append(placeholder);
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

  appendCardImage(article, item, "Előtte-utána eredmény");

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

  appendCardImage(article, item, "Referencia munka");

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
    .order("created_at", { ascending: false });

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
