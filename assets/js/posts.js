import { supabase } from "./supabase-client.js";

const postsGrid = document.getElementById("posts-grid");

function setMessage(message, type = "info") {
  if (!postsGrid) return;

  postsGrid.innerHTML = `<p class="posts-message posts-message--${type}">${message}</p>`;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getPostUrl(post) {
  if (post.url) return post.url;
  if (post.slug) return `./${post.slug}/`;
  return "";
}

function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  if (post.image_url) {
    const image = document.createElement("img");
    image.className = "post-card__image";
    image.src = post.image_url;
    image.alt = post.title || "Tip-Top tudástár bejegyzés";
    image.loading = "lazy";
    article.append(image);
  }

  const body = document.createElement("div");
  body.className = "post-card__body";

  const metaText = formatDate(post.published_at || post.created_at);
  if (metaText) {
    const meta = document.createElement("p");
    meta.className = "post-card__meta";
    meta.textContent = metaText;
    body.append(meta);
  }

  const title = document.createElement("h2");
  title.className = "post-card__title";
  title.textContent = post.title || "Tudástár bejegyzés";
  body.append(title);

  const excerptText = post.excerpt || post.description || post.summary;
  if (excerptText) {
    const excerpt = document.createElement("p");
    excerpt.className = "post-card__excerpt";
    excerpt.textContent = excerptText;
    body.append(excerpt);
  }

  const postUrl = getPostUrl(post);
  if (postUrl) {
    const link = document.createElement("a");
    link.className = "post-card__link";
    link.href = postUrl;
    link.textContent = "Elolvasom";
    body.append(link);
  }

  article.append(body);
  return article;
}

async function loadPosts() {
  if (!postsGrid) return;

  setMessage("Tudástár bejegyzések betöltése...");

  const { data, error } = await supabase
    .from("posts")
    .select("title,slug,excerpt,description,summary,image_url,url,published_at,created_at,status")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Supabase posts error:", error);
    setMessage("A tudástár bejegyzések betöltése nem sikerült. Kérjük, próbáld meg később.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage("Jelenleg nincs publikált tudástár bejegyzés.");
    return;
  }

  postsGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((post) => fragment.append(createPostCard(post)));
  postsGrid.append(fragment);
}

loadPosts();
