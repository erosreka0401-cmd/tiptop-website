import { supabase } from "./supabase-client.js";

const loginPath = "/admin/";
const offersPath = "/admin/offers.html";

function setMessage(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

export async function checkAdminAccess() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    return { ok: false, reason: "A belépési állapot ellenőrzése nem sikerült.", error: sessionError };
  }

  if (!sessionData.session) {
    return { ok: false, reason: "Az admin felület használatához be kell lépni." };
  }

  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    return { ok: false, reason: "Az admin jogosultság ellenőrzése nem sikerült.", error };
  }

  if (data !== true) {
    return { ok: false, reason: "Ehhez a felülethez nincs admin jogosultságod." };
  }

  return { ok: true, session: sessionData.session };
}

export async function requireAdmin({ messageElement, redirect = true } = {}) {
  const access = await checkAdminAccess();

  if (!access.ok) {
    setMessage(messageElement, access.reason, "error");
    if (access.error) {
      console.error("Admin access error:", access.error);
    }
    if (redirect && !access.session) {
      window.location.href = loginPath;
    }
  }

  return access;
}

export function initLoginPage() {
  const form = document.getElementById("admin-login-form");
  const message = document.getElementById("admin-auth-message");

  checkAdminAccess().then((access) => {
    if (access.ok) {
      window.location.href = offersPath;
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(message, "Belépés folyamatban...");

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(message, "A belépés nem sikerült. Ellenőrizd az e-mail címet és a jelszót.", "error");
      return;
    }

    const access = await checkAdminAccess();

    if (!access.ok) {
      setMessage(message, access.reason, "error");
      await supabase.auth.signOut();
      return;
    }

    window.location.href = offersPath;
  });
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
  window.location.href = loginPath;
}
