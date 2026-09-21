// lib/doctors-remote.js

const { CMS_API_URL, CMS_SITE_KEY, CMS_PAGES } = require("./cms");

const DEFAULT_PAGE_REF = CMS_PAGES.homepage;

// Simple in-memory cache to avoid hammering upstream (TTL 2 minutes)
const _cache = new Map();
const TTL_MS = 2 * 60 * 1000;

function cacheGet(key) {
    const item = _cache.get(key);
    if (!item) return null;
    if (Date.now() - item.t > TTL_MS) {
        _cache.delete(key);
        return null;
    }
    return item.v;
}
function cacheSet(key, value) {
    _cache.set(key, { t: Date.now(), v: value });
}

function tableEmbed(comp) {
    return comp?._headless ?? comp?._mave ?? null;
}

async function fetchPageJson(pageRef) {
    const baseUrl = CMS_API_URL.replace(/\/$/, "");
    const url = `${baseUrl}/public/pages/${pageRef}`;
    const cached = cacheGet(url);
    if (cached) return cached;

    const headers = { Accept: "application/json" };
    if (CMS_SITE_KEY) headers["X-Headless-Site-Key"] = CMS_SITE_KEY;

    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`Upstream fetch failed (${res.status}): ${url}`);
    }
    const json = await res.json();
    cacheSet(url, json);
    return json;
}

// Find the first or selected (tableIndex) table component in the page body
function findTableComponent(pageJson, tableIndex) {
    if (!pageJson || !Array.isArray(pageJson.body)) return null;
    const tables = [];

    for (const section of pageJson.body) {
        const data = section?.data;
        if (!Array.isArray(data)) continue;
        for (const comp of data) {
            const embed = tableEmbed(comp);
            if (comp?.type === "table" && embed && Array.isArray(embed.headers) && Array.isArray(embed.rows)) {
                tables.push(comp);
            }
        }
    }

    if (tables.length === 0) return null;
    const idx = Number.isInteger(tableIndex) && tableIndex >= 0 && tableIndex < tables.length ? tableIndex : 0;
    return tables[idx];
}

const COLS = {
    BODY_PART: 0,
    DEPT: 1,
    NAME: 2,
    QUAL: 3,
    DESIG: 4,
    SCHED: 5
};

function parseBodyParts(cell) {
    if (!cell) return null;
    const parts = String(cell)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    return parts.length ? Array.from(new Set(parts)) : null;
}

function rowsToDoctors(headers, rows) {
    // Based on the data structure you provided:
    // ["Body Part","Department","Name","Qualifications","Designation","Schedule","photo_link","Body Part_BN","Department_BN","Name_BN","Qualifications_BN","Designation_BN","Schedule_BN"]
    // Column 0: Body Part (English)
    // Column 1: Department (English)
    // Column 2: Name (English)
    // Column 3: Qualifications (English)
    // Column 4: Designation (English)
    // Column 5: Schedule (English)
    // Column 6: photo_link
    // Column 7: Body Part (Bengali)
    // Column 8: Department (Bengali)
    // Column 9: Name (Bengali)
    // Column 10: Qualifications (Bengali)
    // Column 11: Designation (Bengali)
    // Column 12: Schedule (Bengali)

    const doctors = rows.map((row) => {
        const r = Array.isArray(row) ? row : [];
        const bodyPart = r[0] ?? null; // Body Parts (English)
        const departmentName = r[1] ?? null; // Department (English)

        return {
            bodyParts: parseBodyParts(bodyPart),
            department: departmentName,
            name: r[2] ?? null, // Name (English)
            qualifications: r[3] ?? null, // Qualifications (English)
            designation: r[4] ?? null, // Designation (English)
            schedule: r[5] ?? null // Schedule (English)
        };
    });
    return doctors;
}

async function loadDoctors({ pageId = DEFAULT_PAGE_REF, tableIndex } = {}) {
    const pageJson = await fetchPageJson(pageId);
    const table = findTableComponent(pageJson, Number.isInteger(tableIndex) ? tableIndex : undefined);
    if (!table) return [];
    const embed = tableEmbed(table);
    const headers = embed?.headers || [];
    const rows = embed?.rows || [];
    return rowsToDoctors(headers, rows);
}

async function loadDepartments({ pageId = DEFAULT_PAGE_REF, tableIndex } = {}) {
    const pageJson = await fetchPageJson(pageId);
    const table = findTableComponent(pageJson, Number.isInteger(tableIndex) ? tableIndex : undefined);
    if (!table) return [];

    const embed = tableEmbed(table);
    const headers = embed?.headers || [];
    const rows = embed?.rows || [];

    // Check if this is a department table (has department_name, icon_link, department_name_BN columns)
    const isDeptTable = headers.includes('department_name') && headers.includes('icon_link');

    if (!isDeptTable) return [];

    const deptNameIndex = headers.indexOf('department_name');
    const iconLinkIndex = headers.indexOf('icon_link');
    const deptNameBNIndex = headers.indexOf('department_name_BN');

    return rows.map(row => ({
        name: row[deptNameIndex] || null,
        icon_link: row[iconLinkIndex] || null,
        name_bn: row[deptNameBNIndex] || null
    })).filter(dept => dept.name); // Filter out empty entries
}

function getAllDepartmentsFromDocs(doctors) {
    const deptMap = new Map();
    for (const d of doctors) {
        // The bodyParts field actually contains department names
        if (d.bodyParts && Array.isArray(d.bodyParts)) {
            d.bodyParts.forEach(dept => {
                if (!deptMap.has(dept)) {
                    deptMap.set(dept, {
                        name: dept,
                        icon_link: null // Will be populated from department data if available
                    });
                }
            });
        }
    }
    return Array.from(deptMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getAllBodyPartsFromDocs(doctors) {
    const set = new Set();
    for (const d of doctors) (d.bodyParts || []).forEach(bp => set.add(bp));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ---------- Filtering / Sorting / Pagination helpers ----------
function matchesBodyPart(doc, bodyPart) {
    if (!bodyPart) return true;
    const parts = Array.isArray(bodyPart) ? bodyPart : [bodyPart];
    if (!doc.bodyParts || doc.bodyParts.length === 0) return false;
    const docSet = new Set(doc.bodyParts.map(p => String(p).toLowerCase()));
    return parts.some(p => docSet.has(String(p).toLowerCase()));
}

function matchesDepartment(doc, department) {
    if (!department) return true;
    const deps = Array.isArray(department) ? department : [department];
    if (!doc.department) return false;
    const d = String(doc.department).toLowerCase();
    return deps.some(dep => d === String(dep).toLowerCase());
}

function matchesSearch(doc, q) {
    if (!q) return true;
    const needle = String(q).toLowerCase();
    const hay = [
        doc.name,
        doc.qualifications,
        doc.designation,
        doc.department
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(needle);
}

function sortDoctors(arr, sort, order) {
    const field = sort === "department" ? "department" : "name"; // default name
    const dir = order === "desc" ? "desc" : "asc";
    return arr.sort((a, b) => {
        const av = a[field] ?? "";
        const bv = b[field] ?? "";
        const cmp = String(av).localeCompare(String(bv));
        return dir === "asc" ? cmp : -cmp;
    });
}

function paginate(arr, page, limit) {
    const total = arr.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const p = Math.max(1, Math.min(page, pages));
    const start = (p - 1) * limit;
    const end = start + limit;
    return { data: arr.slice(start, end), meta: { total, page: p, pages, limit } };
}

module.exports = {
    loadDoctors,
    loadDepartments,
    getAllDepartmentsFromDocs,
    getAllBodyPartsFromDocs,
    matchesBodyPart,
    matchesDepartment,
    matchesSearch,
    sortDoctors,
    paginate
};
