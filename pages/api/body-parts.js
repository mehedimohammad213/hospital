// pages/api/body-parts.js
import {
    loadDoctors,
    getAllBodyPartsFromDocs
} from "@/lib/doctors-remote";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { department, pageId, tableIndex } = req.query;

    try {
        const doctors = await loadDoctors({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        if (!department) {
            return res.status(200).json({ data: getAllBodyPartsFromDocs(doctors) });
        }

        const deps = Array.isArray(department) ? department : [department];
        const depsLower = deps.map(s => String(s).toLowerCase());

        const set = new Set();
        for (const d of doctors) {
            if (!d.department) continue;
            if (!depsLower.includes(String(d.department).toLowerCase())) continue;
            (d.bodyParts || []).forEach(bp => set.add(bp));
        }

        return res.status(200).json({ data: Array.from(set).sort((a, b) => a.localeCompare(b)) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to load body parts" });
    }
}
