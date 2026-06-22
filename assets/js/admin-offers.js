import { supabase } from "./supabase-client.js";
import { requireAdmin, signOutAdmin } from "./admin-auth.js";

const state = {
  offers: [],
};

const accessPanel = document.getElementById("admin-access-panel");
const accessMessage = document.getElementById("admin-access-message");
const adminPanel = document.getElementById("offers-admin-panel");
const list = document.getElementById("offers-admin-list");
const form = document.getElementById("offer-form");
const formTitle = document.getElementById("offer-form-title");
const formMessage = document.getElementById("offer-form-message");

function setMessage(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

function normalizeItems(items) {
  if (Array.isArray(items)) return items.join("\n");
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed.join("\n") : items;
    } catch {
      return items;
    }
  }
  return "";
}

function getItemsFromTextarea(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getOfferId(offer) {
  return offer.id ?? offer.uuid ?? offer.offer_id;
}

function resetForm() {
  form?.reset();
  if (!form) return;
  form.elements.id.value = "";
  form.elements.price_label.value = "Ár";
  form.elements.cta_label.value = "Időpontot foglalok";
  form.elements.is_active.checked = true;
  formTitle.textContent = "Új ajánlat";
  setMessage(formMessage, "");
}

function fillForm(offer) {
  if (!form) return;

  form.elements.id.value = getOfferId(offer) || "";
  form.elements.title.value = offer.title || "";
  form.elements.description.value = offer.description || "";
  form.elements.items.value = normalizeItems(offer.items);
  form.elements.price_label.value = offer.price_label || "Ár";
  form.elements.price.value = offer.price || "";
  form.elements.cta_label.value = offer.cta_label || "Időpontot foglalok";
  form.elements.booking_url.value = offer.booking_url || "";
  form.elements.sort_order.value = offer.sort_order ?? "";
  form.elements.is_active.checked = offer.is_active !== false;
  form.elements.image_url.value = offer.image_url || "";
  form.elements.image_file.value = "";
  formTitle.textContent = "Ajánlat szerkesztése";
  setMessage(formMessage, "Szerkesztési mód.");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderOffers() {
  if (!list) return;

  if (!state.offers.length) {
    list.innerHTML = `<p class="admin-message">Még nincs ajánlat az offers táblában.</p>`;
    return;
  }

  list.innerHTML = "";
  const fragment = document.createDocumentFragment();

  state.offers.forEach((offer) => {
    const id = getOfferId(offer);
    const item = document.createElement("article");
    item.className = "admin-offer-item";

    const main = document.createElement("div");
    main.className = "admin-offer-main";

    if (offer.image_url) {
      const image = document.createElement("img");
      image.src = offer.image_url;
      image.alt = offer.title || "Ajánlat";
      image.loading = "lazy";
      main.append(image);
    }

    const content = document.createElement("div");
    const status = document.createElement("span");
    status.className = `admin-status ${offer.is_active ? "is-active" : "is-inactive"}`;
    status.textContent = offer.is_active ? "Aktív" : "Inaktív";

    const title = document.createElement("h3");
    title.textContent = offer.title || "Cím nélküli ajánlat";

    const meta = document.createElement("p");
    meta.textContent = `${offer.price || "Ár nélkül"} · Sorrend: ${offer.sort_order ?? "-"}`;

    content.append(status, title, meta);
    main.append(content);

    const actions = document.createElement("div");
    actions.className = "admin-offer-actions";

    const editButton = document.createElement("button");
    editButton.className = "admin-button admin-button-secondary";
    editButton.type = "button";
    editButton.textContent = "Szerkesztés";
    editButton.addEventListener("click", () => fillForm(offer));

    const toggleButton = document.createElement("button");
    toggleButton.className = "admin-button admin-button-secondary";
    toggleButton.type = "button";
    toggleButton.textContent = offer.is_active ? "Inaktiválás" : "Aktiválás";
    toggleButton.addEventListener("click", () => toggleOffer(id, !offer.is_active));

    actions.append(editButton, toggleButton);
    item.append(main, actions);
    fragment.append(item);
  });

  list.append(fragment);
}

async function loadOffers() {
  if (!list) return;
  list.innerHTML = `<p class="admin-message">Ajánlatok betöltése...</p>`;

  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Admin offers load error:", error);
    list.innerHTML = `<p class="admin-message" data-type="error">Az ajánlatok betöltése nem sikerült.</p>`;
    return;
  }

  state.offers = data || [];
  renderOffers();
}

async function uploadImage(file) {
  if (!file || file.size === 0) return "";

  const safeName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
  const path = `ajanlatok/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("tiptop-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Admin offer image upload error:", error);
    throw new Error("A kép feltöltése nem sikerült.");
  }

  const { data } = supabase.storage.from("tiptop-media").getPublicUrl(path);
  return data.publicUrl;
}

function getPayload(formData, imageUrl) {
  const sortOrderValue = String(formData.get("sort_order") || "").trim();

  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    items: getItemsFromTextarea(formData.get("items")),
    price_label: String(formData.get("price_label") || "").trim() || "Ár",
    price: String(formData.get("price") || "").trim() || null,
    cta_label: String(formData.get("cta_label") || "").trim() || "Időpontot foglalok",
    booking_url: String(formData.get("booking_url") || "").trim() || null,
    image_url: imageUrl || String(formData.get("image_url") || "").trim() || null,
    sort_order: sortOrderValue ? Number(sortOrderValue) : null,
    is_active: formData.get("is_active") === "on",
  };
}

async function saveOffer(event) {
  event.preventDefault();
  if (!form) return;

  setMessage(formMessage, "Mentés folyamatban...");

  const formData = new FormData(form);
  const id = String(formData.get("id") || "").trim();

  try {
    const uploadedImageUrl = await uploadImage(formData.get("image_file"));
    const payload = getPayload(formData, uploadedImageUrl);

    const query = id
      ? supabase.from("offers").update(payload).eq("id", id)
      : supabase.from("offers").insert(payload);

    const { error } = await query;

    if (error) {
      console.error("Admin offer save error:", error);
      setMessage(formMessage, "Az ajánlat mentése nem sikerült. Ellenőrizd a mezőket és az admin jogosultságot.", "error");
      return;
    }

    setMessage(formMessage, "Az ajánlat mentve.");
    resetForm();
    await loadOffers();
  } catch (error) {
    setMessage(formMessage, error.message || "Az ajánlat mentése nem sikerült.", "error");
  }
}

async function toggleOffer(id, nextActiveState) {
  if (!id) {
    list.innerHTML = `<p class="admin-message" data-type="error">Az ajánlat azonosítója hiányzik, ezért nem módosítható.</p>`;
    return;
  }

  const { error } = await supabase
    .from("offers")
    .update({ is_active: nextActiveState })
    .eq("id", id);

  if (error) {
    console.error("Admin offer toggle error:", error);
    list.innerHTML = `<p class="admin-message" data-type="error">Az ajánlat státuszának módosítása nem sikerült.</p>`;
    return;
  }

  await loadOffers();
}

async function init() {
  document.getElementById("admin-logout")?.addEventListener("click", signOutAdmin);
  document.getElementById("offers-refresh")?.addEventListener("click", loadOffers);
  document.getElementById("offer-form-reset")?.addEventListener("click", resetForm);
  form?.addEventListener("submit", saveOffer);

  const access = await requireAdmin({ messageElement: accessMessage, redirect: true });

  if (!access.ok) return;

  accessPanel.hidden = true;
  adminPanel.hidden = false;
  await loadOffers();
}

document.addEventListener("DOMContentLoaded", init);
