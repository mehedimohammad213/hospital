// pages/api/doctors.js
import {
    loadDoctors,
    matchesBodyPart,
    matchesDepartment,
    matchesSearch,
    sortDoctors,
    paginate
} from "@/lib/doctors-remote";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const {
        bodyPart,          // string | string[]
        department,        // string | string[]
        q,                 // string
        sort,              // "name" | "department"
        order,             // "asc" | "desc"
        page = "1",
        limit = "20",
        pageId,            // number (optional, defaults to 131)
        tableIndex         // number (optional if multiple tables exist)
    } = req.query;

    try {
        const doctors = await loadDoctors({
            pageId: pageId ? Number(pageId) : undefined,
            tableIndex: Number.isNaN(Number(tableIndex)) ? undefined : Number(tableIndex)
        });

        const withIds = doctors.map((d, idx) => ({ id: idx + 1, ...d }));

        const filtered = withIds.filter((doc) =>
            matchesBodyPart(doc, bodyPart) &&
            matchesDepartment(doc, department) &&
            matchesSearch(doc, q)
        );

        const sorted = sortDoctors(filtered, sort, order);
        const { data, meta } = paginate(sorted, Number(page), Number(limit));

        return res.status(200).json({ meta, data });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to load doctors" });
    }
}
