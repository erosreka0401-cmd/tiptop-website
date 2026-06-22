import { supabase } from "./supabase-client.js";
import { requireAdmin, signOutAdmin } from "./admin-auth.js";

const accessPanel = document.getElementById("admin-access-panel");
const accessMessage = document.getElementById("admin-access-message");
const adminPanel = document.getElementById("blocks-admin-panel");
const list = document.getElementById("blocks-admin-list");

function setMessage(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

function getBlockId(block) {
  return block.id;
}

function createField(labelText, input) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.append(input);
  return label;
}

function createInput({ name, value = "", type = "text", readOnly = false } = {}) {
  const input = document.createElement("input");
  input.className = "admin-field";
  input.name = name;
  input.type = type;
  input.value = value ?? "";
  input.readOnly = readOnly;
  return input;
}

function createTextarea({ name, value = "", rows = 2 } = {}) {
  const textarea = document.createElement("textarea");
  textarea.className = "admin-field";
  textarea.name = name;
  textarea.rows = rows;
  textarea.value = value ?? "";
  return textarea;
}

function safeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

async function uploadBlockImage(file, blockKey) {
  if (!file || file.size === 0) return "";

  const path = `blokkok/${blockKey || "site-block"}-${Date.now()}-${safeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from("tiptop-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Block image upload error:", error);
    throw new Error("A kép feltöltése nem sikerült. Ellenőrizd a Storage jogosultságot és a blokkok mappát.");
  }

  const { data } = supabase.storage.from("tiptop-media").getPublicUrl(path);
  return data.publicUrl;
}

async function saveBlock(form, block) {
  const message = form.querySelector(".admin-block-message");
  setMessage(message, "Mentés folyamatban...");

  const formData = new FormData(form);
  const id = getBlockId(block);

  if (!id) {
    setMessage(message, "A blokk azonosítója hiányzik, ezért nem menthető.", "error");
    return;
  }

  try {
    const uploadedImageUrl = await uploadBlockImage(formData.get("image_file"), block.block_key);
    const sortOrderValue = String(formData.get("sort_order") || "").trim();

    const payload = {
      title: String(formData.get("title") || "").trim() || null,
      image_url: uploadedImageUrl || String(formData.get("image_url") || "").trim() || null,
      alt_text: String(formData.get("alt_text") || "").trim() || null,
      is_active: formData.get("is_active") === "on",
      sort_order: sortOrderValue ? Number(sortOrderValue) : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_blocks")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Block save error:", error);
      setMessage(message, "A blokk mentése nem sikerült. Ellenőrizd az admin jogosultságot és az adatbázis mezőket.", "error");
      return;
    }

    setMessage(message, "A blokk mentve.");
    await loadBlocks();
  } catch (error) {
    setMessage(message, error.message || "A blokk mentése nem sikerült.", "error");
  }
}

function createBlockCard(block) {
  const form = document.createElement("form");
  form.className = "admin-block-card";

  const header = document.createElement("div");
  header.className = "admin-block-header";

  const titleWrap = document.createElement("div");
  const section = document.createElement("p");
  section.className = "admin-kicker";
  section.textContent = block.section_label || block.page || "Blokk";

  const title = document.createElement("h3");
  title.textContent = block.title || block.block_key || "Blokk";

  const key = document.createElement("p");
  key.className = "admin-block-key";
  key.textContent = block.block_key || "block_key nélkül";

  titleWrap.append(section, title, key);

  const status = document.createElement("span");
  status.className = `admin-status ${block.is_active ? "is-active" : "is-inactive"}`;
  status.textContent = block.is_active ? "Aktív" : "Inaktív";

  header.append(titleWrap, status);
  form.append(header);

  if (block.image_url) {
    const preview = document.createElement("img");
    preview.className = "admin-block-preview";
    preview.src = block.image_url;
    preview.alt = block.alt_text || block.title || block.block_key || "Blokk kép";
    preview.loading = "lazy";
    form.append(preview);
  }

  form.append(createField("Blokk kulcs", createInput({ name: "block_key", value: block.block_key, readOnly: true })));
  form.append(createField("Cím", createInput({ name: "title", value: block.title })));
  form.append(createField("Kép URL", createInput({ name: "image_url", value: block.image_url, type: "url" })));
  form.append(createField("Alt szöveg", createTextarea({ name: "alt_text", value: block.alt_text, rows: 2 })));

  const grid = document.createElement("div");
  grid.className = "admin-field-grid";
  grid.append(createField("Sorrend", createInput({ name: "sort_order", value: block.sort_order ?? "", type: "number" })));

  const activeLabel = document.createElement("label");
  activeLabel.className = "admin-checkbox";
  const activeInput = document.createElement("input");
  activeInput.type = "checkbox";
  activeInput.name = "is_active";
  activeInput.checked = block.is_active !== false;
  activeLabel.append(activeInput, document.createTextNode("Aktív blokk"));
  grid.append(activeLabel);
  form.append(grid);

  const fileInput = createInput({ name: "image_file", type: "file" });
  fileInput.accept = "image/*";
  form.append(createField("Új kép feltöltése", fileInput));

  const actions = document.createElement("div");
  actions.className = "admin-form-head";

  const saveButton = document.createElement("button");
  saveButton.className = "admin-button";
  saveButton.type = "submit";
  saveButton.textContent = "Mentés";

  const message = document.createElement("p");
  message.className = "admin-message admin-block-message";
  message.setAttribute("role", "status");

  actions.append(saveButton, message);
  form.append(actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveBlock(form, block);
  });

  return form;
}

function renderBlocks(blocks) {
  if (!list) return;

  if (!blocks.length) {
    list.innerHTML = `<p class="admin-message">Még nincs blokk a site_blocks táblában.</p>`;
    return;
  }

  list.innerHTML = "";
  const fragment = document.createDocumentFragment();
  blocks.forEach((block) => fragment.append(createBlockCard(block)));
  list.append(fragment);
}

async function loadBlocks() {
  if (!list) return;

  list.innerHTML = `<p class="admin-message">Blokkok betöltése...</p>`;

  const { data, error } = await supabase
    .from("site_blocks")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Blocks load error:", error);
    list.innerHTML = `<p class="admin-message" data-type="error">A blokkok betöltése nem sikerült. Ellenőrizd, hogy a site_blocks tábla és az RLS policy-k létrejöttek.</p>`;
    return;
  }

  renderBlocks(data || []);
}

async function init() {
  document.getElementById("admin-logout")?.addEventListener("click", signOutAdmin);
  document.getElementById("blocks-refresh")?.addEventListener("click", loadBlocks);

  const access = await requireAdmin({ messageElement: accessMessage, redirect: true });

  if (!access.ok) return;

  accessPanel.hidden = true;
  adminPanel.hidden = false;
  await loadBlocks();
}

document.addEventListener("DOMContentLoaded", init);
