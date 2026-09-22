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
  caseStories: process.env.NEXT_PUBLIC_CASE_STORIES_SLUG || "case-story",
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

/**
 * When the CMS returns navbars with empty `menu_item_ids` / `menu_items`
 * (common after reseeds that drop menu links), use these known Sajida links.
 * Prefer live `/menuitems` matches by title or path when available.
 */
const NAVBAR_MENU_FALLBACKS = {
  "Sajida Main Nav": [
    { title: "Home", title_bn: "হোম", link: "/" },
    { title: "About Us", title_bn: "আমাদের সম্পর্কে", link: "/about" },
    { title: "Our Services", title_bn: "আমাদের সেবাসমূহ", link: "/services" },
    { title: "Specialists", title_bn: "বিশেষজ্ঞবৃন্দ", link: "/specialists" },
    { title: "Success Stories", title_bn: "সাফল্যের গল্প", link: "/stories" },
    { title: "Contact Us", title_bn: "যোগাযোগ করুন", link: "/contact" },
  ],
  "Sajida Main Nav Bangla": [
    { title: "Home", title_bn: "হোম", link: "/" },
    { title: "About Us", title_bn: "আমাদের সম্পর্কে", link: "/about" },
    { title: "Our Services", title_bn: "আমাদের সেবাসমূহ", link: "/services" },
    { title: "Specialists", title_bn: "বিশেষজ্ঞবৃন্দ", link: "/specialists" },
    { title: "Success Stories", title_bn: "সাফল্যের গল্প", link: "/stories" },
    { title: "Contact Us", title_bn: "যোগাযোগ করুন", link: "/contact" },
  ],
  SajidaOne: [
    { title: "Ambulance", title_bn: "এ্যাম্বুলেন্স", link: "/ambulance" },
    { title: "Emergency Call", title_bn: "জরুরি কল", link: "/emergency-call" },
    {
      title: "Appointment",
      title_bn: "অ্যাপয়েন্টমেন্ট",
      link: "http://182.163.120.3:8886/sfords/r/chms/app/appt-online",
    },
  ],
};

function stripQuery(url = "") {
  return String(url).split("?")[0];
}

function menuItemPath(item) {
  return stripQuery(item?.link || "").replace(/^https?:\/\/[^/]+/, "") || "/";
}

/** Resolve menu items from navbar payload, id list, or title-based fallbacks. */
export function resolveNavbarMenuItems(nav, allMenuItems = []) {
  const embedded = nav?.menu?.menu_items ?? nav?.menu_items ?? [];
  if (Array.isArray(embedded) && embedded.length > 0) return embedded;

  const ids = nav?.menu_item_ids ?? nav?.menu?.menu_item_ids ?? [];
  if (Array.isArray(ids) && ids.length > 0 && allMenuItems.length > 0) {
    const byId = new Map(allMenuItems.map((item) => [String(item.id), item]));
    const resolved = ids.map((id) => byId.get(String(id))).filter(Boolean);
    if (resolved.length > 0) return resolved;
  }

  const fallback = NAVBAR_MENU_FALLBACKS[nav?.title_en] || [];
  if (!fallback.length) return [];

  const byTitle = new Map(
    allMenuItems.map((item) => [String(item.title || "").toLowerCase(), item])
  );
  const byPath = new Map(
    allMenuItems.map((item) => [menuItemPath(item), item])
  );

  return fallback.map((item, index) => {
    const path = menuItemPath(item);
    // Prefer title match. Path match is only safe for non-root links — many
    // CMS items reuse "/" and would steal the Home slot.
    const live =
      byTitle.get(String(item.title).toLowerCase()) ||
      (path !== "/" ? byPath.get(path) : null);
    return {
      id: live?.id ?? `fallback-${nav?.title_en || "nav"}-${index}`,
      title: live?.title || item.title,
      title_bn: live?.title_bn || item.title_bn,
      link: live?.link || item.link,
      parent_id: live?.parent_id ?? null,
    };
  });
}

/** Map headless navbar shape onto the nested `menu.menu_items` the UI expects. */
export function normalizeNavbar(nav, { menuItems = [], logo = null } = {}) {
  if (!nav || typeof nav !== "object") return null;
  const resolvedItems = resolveNavbarMenuItems(nav, menuItems);
  const resolvedLogo = logo || nav.logo || null;
  return {
    ...nav,
    logo: resolvedLogo,
    menu_items: resolvedItems,
    menu: {
      ...(nav.menu || {}),
      menu_items: resolvedItems,
    },
  };
}

/**
 * Build `/{base}/{slug}?…` from CMS link_url values like
 * `/caring-for-every-life?page_id=159&pageName=Caring for Every Life`.
 * Prefer slug routing — embedded page_ids are often stale after reseeds.
 */
export function buildCmsCollectionHref(basePath, linkUrl) {
  if (!linkUrl || typeof linkUrl !== "string") return null;
  const base = String(basePath || "").replace(/\/+$/, "");
  const raw = linkUrl.trim();
  if (!raw) return null;
  if (base && raw.startsWith(`${base}/`)) return raw;

  try {
    const url = new URL(raw, "http://local.invalid");
    const slug = url.pathname.replace(/^\/+/, "").split("/").filter(Boolean)[0];
    if (!slug) return null;
    const qs = url.searchParams.toString();
    return `${base}/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`;
  } catch {
    const cleaned = raw.replace(/^\//, "");
    return cleaned ? `${base}/${cleaned}` : null;
  }
}

