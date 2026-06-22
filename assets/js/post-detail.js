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

function parseInlineMetadata(content) {
  const normalized = String(content || "").replace(/\r\n/g, "\n");
  const ctaMatch = normalized.match(/\n(?:CTA|Cta|cta):\s*\n([\s\S]*?)(?=\n(?:GYIK|Gyakori kérdések|FAQ):\s*\n|$)/);
  const faqMatch = normalized.match(/\n(?:GYIK|Gyakori kérdések|FAQ):\s*\n([\s\S]*)$/);
  let cleanContent = normalized;
  let cta = null;
  let faqs = [];

  if (ctaMatch) {
    cleanContent = cleanContent.replace(ctaMatch[0], "");
    const lines = ctaMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const label = lines.find((line) => /^(gomb|label|szöveg):/i.test(line))?.replace(/^(gomb|label|szöveg):\s*/i, "");
    const url = lines.find((line) => /^(url|link):/i.test(line))?.replace(/^(url|link):\s*/i, "");
    const text = lines.find((line) => /^(leírás|bevezető|intro):/i.test(line))?.replace(/^(leírás|bevezető|intro):\s*/i, "");

    if (label && url) {
      cta = { label, url, text: text || "" };
    }
  }

  if (faqMatch) {
    cleanContent = cleanContent.replace(faqMatch[0], "");
    const blocks = faqMatch[1]
      .trim()
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    faqs = blocks
      .map((block) => {
        const question = block.match(/^(?:K|Q|Kérdés):\s*(.+)$/im)?.[1] || "";
        const answer = block.match(/^(?:V|A|Válasz):\s*([\s\S]+)$/im)?.[1] || "";
        return {
          question: question.trim(),
          answer: answer.trim().replace(/\n+/g, " "),
        };
      })
      .filter((item) => item.question && item.answer);
  }

  return {
    content: cleanContent.trim(),
    cta,
    faqs,
  };
}

function createContentBlock(block) {
  const trimmed = block.trim();

  if (trimmed.startsWith("### ")) {
    const heading = document.createElement("h3");
    heading.textContent = trimmed.replace(/^###\s+/, "");
    return heading;
  }

  if (trimmed.startsWith("## ")) {
    const heading = document.createElement("h2");
    heading.textContent = trimmed.replace(/^##\s+/, "");
    return heading;
  }

  const listItems = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- ") || line.startsWith("* "));

  if (listItems.length > 1) {
    const list = document.createElement("ul");
    listItems.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line.replace(/^[-*]\s+/, "");
      list.append(item);
    });
    return list;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = trimmed.replace(/\n+/g, " ");
  return paragraph;
}

function appendArticleContent(parent, text) {
  const content = String(text || "").trim();
  if (!content) return;

  const wrapper = document.createElement("div");
  wrapper.className = "post-detail-content";

  content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .forEach((block) => wrapper.append(createContentBlock(block)));

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

  const parsedContent = parseInlineMetadata(getPostContent(post));
  if (parsedContent.content) {
    appendArticleContent(articleRoot, parsedContent.content);
  } else {
    articleRoot.append(createMessage("Ehhez a cikkhez m?g nincs felt?lt?tt sz?veges tartalom."));
  }

  const postFaqs = getPostFaqs(post);
  appendCta(articleRoot, getPostCta(post) || parsedContent.cta);
  appendFaqs(articleRoot, postFaqs.length ? postFaqs : parsedContent.faqs);
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
