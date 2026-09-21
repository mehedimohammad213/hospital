// pages/api/departments.js
import {
    loadDoctors,
    loadDepartments,
    getAllDepartmentsFromDocs
} from "@/lib/doctors-remote";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { bodyPart, pageId, tableIndex } = req.query;

    try {
        // First try to load departments with icons from department table
        const departments = await loadDepartments({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        if (departments.length > 0) {
            if (!bodyPart) {
                return res.status(200).json({ data: departments });
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

            return res.status(200).json({ data: filteredDepartments });
        }

        // Fallback to old method if no department table found
        const doctors = await loadDoctors({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        if (!bodyPart) {
            return res.status(200).json({ data: getAllDepartmentsFromDocs(doctors) });
        }

        const bp = Array.isArray(bodyPart) ? bodyPart : [bodyPart];
        const bpLower = bp.map(s => String(s).toLowerCase());

        const set = new Set();
        for (const d of doctors) {
            const hasBP = (d.bodyParts || []).some(p => bpLower.includes(String(p).toLowerCase()));
            if (hasBP && d.department) set.add(d.department);
        }

        return res.status(200).json({ data: Array.from(set).sort((a, b) => a.localeCompare(b)) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to load departments" });
    }
}
