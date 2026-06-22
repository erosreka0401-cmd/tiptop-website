import { supabase } from "./supabase-client.js";

const grids = {
  posts: document.getElementById("posts-grid"),
  beforeAfter: document.getElementById("before-after-grid"),
  references: document.getElementById("references-grid"),
};

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

function createCta(label, href = "#") {
  const cta = document.createElement("a");
  cta.className = "tudastar-card__cta";
  cta.href = href;
  cta.textContent = label;
  return cta;
}

function getDetailUrl(item) {
  if (item.url) return item.url;
  if (item.slug) return `./${item.slug}/`;
  return "#";
}

function normalizeGallery(gallery) {
  if (Array.isArray(gallery)) return gallery;

  if (typeof gallery === "string" && gallery.trim()) {
    try {
      const parsedGallery = JSON.parse(gallery);
      return Array.isArray(parsedGallery) ? parsedGallery : [gallery];
    } catch {
      return [gallery];
    }
  }

  return [];
}

function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  if (post.image_url) {
    const image = document.createElement("img");
    image.className = "tudastar-card__image";
    image.src = post.image_url;
    image.alt = post.title || "Tip-Top szakértői cikk";
    image.loading = "lazy";
    article.append(image);
  }

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
  body.append(createCta("Elolvasom", getDetailUrl(post)));

  article.append(body);
  return article;
}

function createBeforeAfterCard(item) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  if (item.before_image_url || item.after_image_url) {
    const imageWrap = document.createElement("div");
    imageWrap.className = "tudastar-card__before-after";

    if (item.before_image_url) {
      const beforeImage = document.createElement("img");
      beforeImage.src = item.before_image_url;
      beforeImage.alt = `${item.title || "Előtte-utána munka"} előtte`;
      beforeImage.loading = "lazy";
      imageWrap.append(beforeImage);
    }

    if (item.after_image_url) {
      const afterImage = document.createElement("img");
      afterImage.src = item.after_image_url;
      afterImage.alt = `${item.title || "Előtte-utána munka"} utána`;
      afterImage.loading = "lazy";
      imageWrap.append(afterImage);
    }

    article.append(imageWrap);
  }

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
  body.append(createCta("Megnézem az eredményt", getDetailUrl(item)));

  article.append(body);
  return article;
}

function createReferenceCard(item) {
  const article = document.createElement("article");
  article.className = "tudastar-card";

  const gallery = normalizeGallery(item.gallery);
  const firstImage = gallery[0];

  if (firstImage) {
    const image = document.createElement("img");
    image.className = "tudastar-card__image";
    image.src = firstImage;
    image.alt = item.title || "Tip-Top referencia munka";
    image.loading = "lazy";
    article.append(image);
  }

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
  body.append(createCta("Megnézem a munkát", getDetailUrl(item)));

  article.append(body);
  return article;
}

async function loadSection({ grid, loadingText, emptyText, errorText, query, createCard }) {
  if (!grid) return;

  setMessage(grid, loadingText);

  const { data, error } = await query();

  if (error) {
    console.error(errorText, error);
    setMessage(grid, errorText, "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage(grid, emptyText);
    return;
  }

  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((item) => fragment.append(createCard(item)));
  grid.append(fragment);
}

loadSection({
  grid: grids.posts,
  loadingText: "Tudástár cikkek betöltése...",
  emptyText: "Jelenleg nincs publikált cikk.",
  errorText: "A tudástár cikkek betöltése nem sikerült.",
  query: () =>
    supabase
      .from("posts")
      .select("title,slug,url,image_url,type,category,excerpt,description,summary,status,created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
  createCard: createPostCard,
});

loadSection({
  grid: grids.beforeAfter,
  loadingText: "Előtte-utána munkák betöltése...",
  emptyText: "Jelenleg nincs aktív előtte-utána munka.",
  errorText: "Az előtte-utána munkák betöltése nem sikerült.",
  query: () =>
    supabase
      .from("before_after")
      .select("title,slug,url,before_image_url,after_image_url,category,problem,solution,result,related_service,is_active,sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  createCard: createBeforeAfterCard,
});

loadSection({
  grid: grids.references,
  loadingText: "Referencia munkák betöltése...",
  emptyText: "Jelenleg nincs aktív referencia munka.",
  errorText: "A referencia munkák betöltése nem sikerült.",
  query: () =>
    supabase
      .from("references")
      .select("title,slug,url,gallery,car_type,category,problem,solution,result,related_service,is_active,sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  createCard: createReferenceCard,
});
