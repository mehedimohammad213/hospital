// lib/client-api.js
// Client-side API functions for static export

const { loadDoctors, loadDepartments, getAllDepartmentsFromDocs } = require('./doctors-remote');
const { CMS_PAGES } = require('./cms');

async function getDepartments(bodyPart = null, pageId = CMS_PAGES.homepage, tableIndex = 0) {
    try {
        // First try to load departments with icons from department table
        const departments = await loadDepartments({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        if (departments.length > 0) {
            if (!bodyPart) {
                return { data: departments };
            }

            // Filter departments by body part if specified
            const doctors = await loadDoctors({
                pageId: pageId ? Number(pageId) : undefined,
                tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
            });

            const bp = Array.isArray(bodyPart) ? bodyPart : [bodyPart];
            const bpLower = bp.map(s => String(s).toLowerCase());

            const validDeptNames = new Set();
            for (const d of doctors) {
                const hasBP = (d.bodyParts || []).some(p => bpLower.includes(String(p).toLowerCase()));
                if (hasBP && d.department) validDeptNames.add(d.department);
            }

            const filteredDepartments = departments.filter(dept =>
                validDeptNames.has(dept.name)
            );

            return { data: filteredDepartments };
        }

        // Fallback to old method if no department table found
        const doctors = await loadDoctors({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        if (!bodyPart) {
            return { data: getAllDepartmentsFromDocs(doctors) };
        }

        const bp = Array.isArray(bodyPart) ? bodyPart : [bodyPart];
        const bpLower = bp.map(s => String(s).toLowerCase());

        const set = new Set();
        for (const d of doctors) {
            const hasBP = (d.bodyParts || []).some(p => bpLower.includes(String(p).toLowerCase()));
            if (hasBP && d.department) set.add(d.department);
        }

        return { data: Array.from(set).sort((a, b) => a.localeCompare(b)) };
    } catch (e) {
        console.error(e);
        throw new Error("Failed to load departments");
    }
}

async function getDoctors(department = null, bodyPart = null, pageId = CMS_PAGES.homepage, tableIndex = 0) {
    try {
        const doctors = await loadDoctors({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        let filteredDoctors = doctors;

        if (department) {
            const deps = Array.isArray(department) ? department : [department];
            filteredDoctors = filteredDoctors.filter(d =>
                deps.some(dep => String(d.department).toLowerCase() === String(dep).toLowerCase())
            );
        }

        if (bodyPart) {
            const bp = Array.isArray(bodyPart) ? bodyPart : [bodyPart];
            const bpLower = bp.map(s => String(s).toLowerCase());
            filteredDoctors = filteredDoctors.filter(d =>
                (d.bodyParts || []).some(p => bpLower.includes(String(p).toLowerCase()))
            );
        }

        return { data: filteredDoctors };
    } catch (e) {
        console.error(e);
        throw new Error("Failed to load doctors");
    }
}

// Also export as CommonJS for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDepartments,
        getDoctors
    };
}
