import { supabase } from "./supabase-client.js";

const articleRoot = document.getElementById("post-detail");

function setMessage(message, type = "info") {
  if (!articleRoot) return;
  articleRoot.innerHTML = `<p class="post-detail-message post-detail-message--${type}">${message}</p>`;
}

function createMessage(message, type = "info") {
  const element = document.createElement("p");
  element.className = `post-detail-message post-detail-message--${type}`;
  element.textContent = message;
  return element;
}

function appendText(parent, className, text) {
  if (!text) return;

  const element = document.createElement("p");
  element.className = className;
  element.textContent = text;
  parent.append(element);
}

function getPostContent(post) {
  return post.content || post.body || post.article_text || post.text || post.full_text || "";
}

function getPostCta(post) {
  const label = post.cta_label || post.cta_text || post.button_label || "";
  const url = post.cta_url || post.cta_href || post.button_url || "";
  const text = post.cta_description || post.cta_intro || "";

  if (!label || !url) return null;
  return { label, url, text };
}

function parseJsonField(value) {
  if (!value) return null;
  if (Array.isArray(value) || typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeFaqs(value) {
  const parsed = parseJsonField(value);
  const items = Array.isArray(parsed) ? parsed : parsed?.items;
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      question: item.question || item.q || item.title || "",
      answer: item.answer || item.a || item.text || "",
    }))
    .filter((item) => item.question && item.answer);
}

function getPostFaqs(post) {
  return normalizeFaqs(post.faqs || post.faq || post.faq_items || post.questions);
}

function createContentElement(block) {
  const trimmed = block.text.trim();

  if (block.type === "h3") {
    const heading = document.createElement("h3");
    heading.textContent = trimmed;
    return heading;
  }

  if (block.type === "h2") {
    const heading = document.createElement("h2");
    heading.textContent = trimmed;
    return heading;
  }

  if (block.type === "ul") {
    const list = document.createElement("ul");
    block.items.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.append(item);
    });
    return list;
  }

  if (block.type === "ol") {
    const list = document.createElement("ol");
    block.items.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.append(item);
    });
    return list;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = trimmed.replace(/\n+/g, " ");
  return paragraph;
}

function parseMarkdownBlocks(text) {
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };

  String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((rawLine) => {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph();
        flushList();
        return;
      }

      if (line.startsWith("### ")) {
        flushParagraph();
        flushList();
        blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
        return;
      }

      if (line.startsWith("## ")) {
        flushParagraph();
        flushList();
        blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
        return;
      }

      if (/^[-*]\s+/.test(line)) {
        flushParagraph();
        if (!list || list.type !== "ul") {
          flushList();
          list = { type: "ul", items: [] };
        }
        list.items.push(line.replace(/^[-*]\s+/, ""));
        return;
      }

      if (/^\d+[.)]\s+/.test(line)) {
        flushParagraph();
        if (!list || list.type !== "ol") {
          flushList();
          list = { type: "ol", items: [] };
        }
        list.items.push(line.replace(/^\d+[.)]\s+/, ""));
        return;
      }

      flushList();
      paragraph.push(line);
    });

  flushParagraph();
  flushList();
  return blocks;
}

function appendArticleContent(parent, text) {
  const content = String(text || "").trim();
  if (!content) return;

  const wrapper = document.createElement("div");
  wrapper.className = "post-detail-content";

  parseMarkdownBlocks(content).forEach((block) => wrapper.append(createContentElement(block)));

  parent.append(wrapper);
}

function appendCta(parent, cta) {
  if (!cta) return;

  const section = document.createElement("aside");
  section.className = "post-detail-cta";

  if (cta.text) {
    const text = document.createElement("p");
    text.textContent = cta.text;
    section.append(text);
  }

  const link = document.createElement("a");
  link.href = cta.url;
  link.textContent = cta.label;
  section.append(link);

  parent.append(section);
}

function appendFaqs(parent, faqs) {
  if (!faqs.length) return;

  const section = document.createElement("section");
  section.className = "post-detail-faq";

  const title = document.createElement("h2");
  title.textContent = "Gyakori kérdések";
  section.append(title);

  faqs.forEach((faq) => {
    const item = document.createElement("details");
    item.className = "post-detail-faq-item";

    const summary = document.createElement("summary");
    summary.textContent = faq.question;

    const answer = document.createElement("p");
    answer.textContent = faq.answer;

    item.append(summary, answer);
    section.append(item);
  });

  parent.append(section);
}

function appendRelatedService(parent, relatedService) {
  if (!relatedService) return;

  const section = document.createElement("aside");
  section.className = "post-detail-related-service";

  const label = document.createElement("span");
  label.textContent = "Kapcsolódó szolgáltatás";

  const text = document.createElement("strong");
  text.textContent = relatedService;

  section.append(label, text);
  parent.append(section);
}

function renderPost(post) {
  if (!articleRoot) return;

  articleRoot.innerHTML = "";

  const backLink = document.createElement("a");
  backLink.className = "post-detail-back";
  backLink.href = "../";
  backLink.textContent = "Vissza a Tudástárhoz";

  const header = document.createElement("header");
  header.className = "post-detail-head";

  const badges = document.createElement("div");
  badges.className = "tudastar-card__badges";

  const type = document.createElement("span");
  type.className = "tudastar-card__badge";
  type.textContent = post.type || "Szakértői cikk";
  badges.append(type);

  if (post.category) {
    const category = document.createElement("span");
    category.className = "tudastar-card__badge";
    category.textContent = post.category;
    badges.append(category);
  }

  const title = document.createElement("h1");
  title.className = "post-detail-title";
  title.textContent = post.title || "Tudástár cikk";

  header.append(badges, title);
  appendText(header, "post-detail-lead", post.excerpt || post.description || post.summary);

  articleRoot.append(backLink, header);

  if (post.image_url) {
    const image = document.createElement("img");
    image.className = "post-detail-image";
    image.src = post.image_url;
    image.alt = post.alt_text || post.title || "Tudástár cikk képe";
    articleRoot.append(image);
  }

  const content = getPostContent(post);
  if (content) {
    appendArticleContent(articleRoot, content);
  } else {
    articleRoot.append(createMessage("Ehhez a cikkhez még nincs feltöltött szöveges tartalom."));
  }

  appendRelatedService(articleRoot, post.related_service);
  appendCta(articleRoot, getPostCta(post));
  appendFaqs(articleRoot, getPostFaqs(post));
}

async function loadPost() {
  if (!articleRoot) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const id = params.get("id");

  if (!slug && !id) {
    setMessage("Hiányzik a cikk azonosítója.", "error");
    return;
  }

  setMessage("Cikk betöltése...");

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .limit(1);

  query = slug ? query.eq("slug", slug) : query.eq("id", id);

  const { data, error } = await query;

  if (error) {
    console.error("Post detail Supabase error:", error);
    setMessage("A cikk betöltése nem sikerült.", "error");
    return;
  }

  if (!data || data.length === 0) {
    setMessage("A keresett cikk nem található.", "error");
    return;
  }

  renderPost(data[0]);
}

document.addEventListener("DOMContentLoaded", loadPost);
