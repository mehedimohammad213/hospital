export const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000/api";

export const CMS_SITE_KEY = process.env.NEXT_PUBLIC_CMS_SITE_KEY || "";

const mediaBase =
  process.env.NEXT_PUBLIC_MEDIA_URL ||
  CMS_API_URL.replace(/\/api\/?$/, "") ||
  "";

export const MEDIA_URL = mediaBase.endsWith("/") ? mediaBase : `${mediaBase}/`;

/** Page slugs — stable across local/production (unlike numeric IDs). */
export const CMS_PAGES = {
  homepage: process.env.NEXT_PUBLIC_HOMEPAGE_SLUG || "homepage",
  about: process.env.NEXT_PUBLIC_ABOUT_SLUG || "about-us",
  services: process.env.NEXT_PUBLIC_SERVICES_SLUG || "our-services",
  newsroom: process.env.NEXT_PUBLIC_NEWSROOM_SLUG || "newsroom",
  contact: process.env.NEXT_PUBLIC_CONTACT_SLUG || "contact-us",
  caseStories: process.env.NEXT_PUBLIC_CASE_STORIES_SLUG || "case-stories",
  specialists: process.env.NEXT_PUBLIC_SPECIALISTS_SLUG || "specialists",
};

export const APPOINTMENT_FORM_ID =
  process.env.NEXT_PUBLIC_APPOINTMENT_FORM_ID || "8";

export function pagePath(slugOrId) {
  return `/pages/${slugOrId}`;
}

/** Build full URL for a CMS media file path. */
export function cmsMediaUrl(filePath) {
  if (!filePath) return "";
  if (typeof filePath === "string" && filePath.startsWith("http")) return filePath;
  return `${MEDIA_URL}${String(filePath).replace(/^\//, "")}`;
}

/** Read embedded component data (_headless locally, _mave on legacy staging). */
export function cmsEmbed(component) {
  if (!component || typeof component !== "object") return null;
  return component._headless ?? component._mave ?? null;
}

/** Ensure legacy `_mave` alias exists when API returns `_headless` only. */
export function normalizeCmsData(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeCmsData);
  }
  if (!node || typeof node !== "object") {
    return node;
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = normalizeCmsData(value);
  }
  if (out._headless && !out._mave) {
    out._mave = out._headless;
  }
  return out;
}

/**
 * Public list endpoints return `{ data, meta }`; some clients historically
 * returned a bare array. Always return the array of records.
 */
export function unwrapCmsList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

/** Map headless navbar shape onto the nested `menu.menu_items` the UI expects. */
export function normalizeNavbar(nav) {
  if (!nav || typeof nav !== "object") return null;
  const menuItems = nav.menu?.menu_items ?? nav.menu_items ?? [];
  return {
    ...nav,
    menu: {
      ...(nav.menu || {}),
      menu_items: menuItems,
    },
  };
}
