// Utility service to extract and process data from page API response
import { cmsMediaUrl } from "@/lib/cms";

const tableEmbed = (component) => component?._headless ?? component?._mave;

const normalizeHeader = (header) =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const HEADER_ALIASES = {
  bodyPart: ["body_part", "bodypart"],
  bodyPartBn: ["body_part_bn", "bodypart_bn"],
  department: ["department", "department_name"],
  departmentBn: ["department_bn", "department_name_bn"],
  name: ["name"],
  nameBn: ["name_bn"],
  qualifications: ["qualifications", "qualification"],
  qualificationsBn: ["qualifications_bn", "qualification_bn"],
  designation: ["designation"],
  designationBn: ["designation_bn"],
  schedule: ["schedule"],
  scheduleBn: ["schedule_bn"],
  photo: ["photo_link", "photo", "image", "image_link"],
  icon: ["icon_link", "icon"],
};

function buildHeaderIndex(headers = []) {
  const index = {};
  headers.forEach((header, i) => {
    index[normalizeHeader(header)] = i;
  });
  return index;
}

function cellByAliases(row, headerIndex, aliases, fallbackIndex = -1) {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(headerIndex, alias)) {
      return row[headerIndex[alias]] ?? null;
    }
  }
  if (fallbackIndex >= 0 && fallbackIndex < row.length) {
    return row[fallbackIndex] ?? null;
  }
  return null;
}

function splitBodyParts(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveMediaUrl(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  // Bengali/plain text accidentally read as a path is not a media URL
  if (!/^https?:\/\//i.test(raw) && !raw.includes("/") && !/\.(png|jpe?g|webp|gif|svg)$/i.test(raw)) {
    return null;
  }
  if (/^https?:\/\//i.test(raw)) return raw;
  return cmsMediaUrl(raw);
}

// Helper function to create consistent slugs
export const createSlug = (name) => {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Helper function to create unique IDs
export const createUniqueId = (name, index) => {
  const slug = createSlug(name);
  return `doctor-${index + 1}-${slug}`;
};

// Helper function to get default Bengali translations for departments
const getDefaultBengaliTranslation = (departmentName) => {
  const translations = {
    Ultrasonography: "আল্ট্রাসনোগ্রাফি",
    "Food and nutrition specialist": "খাদ্য ও পুষ্টি বিশেষজ্ঞ",
    "Dermatology & Venereology": "চর্ম ও যৌনরোগ",
    Nephrology: "নেফ্রোলজি (কিডনি)",
    Cardiology: "কার্ডিওলজি (হৃদরোগ)",
    ENT: "ইএনটি (কান-নাক-গলা)",
    "Pediatrics & NICU": "শিশুরোগ ও এনআইসিইউ",
    Orthopaedic: "অর্থোপেডিক্স",
    "Gynae & OBS": "গাইনি ও প্রসূতি",
    Anesthesia: "অ্যানেস্থেসিয়া",
    "General Surgery": "সাধারণ সার্জারি",
    Medicine: "মেডিসিন",
  };

  return translations[departmentName] || departmentName;
};

export const extractBodyPartsAndDepartments = (pageData) => {
  if (!pageData || !pageData.body) {
    return {
      departments: [],
      doctors: [],
      bodyParts: [],
    };
  }

  let departments = [];
  let doctors = [];
  let bodyParts = [];

  const doctorSection = pageData.body.find(
    (section) =>
      section.title === "Section 8" ||
      section.data?.some((component) => component.type === "table")
  );

  if (doctorSection) {
    const departmentTable = doctorSection.data.find((component) => {
      const headers = tableEmbed(component)?.headers || [];
      const normalized = headers.map(normalizeHeader);
      return (
        component.type === "table" &&
        normalized.some((h) => HEADER_ALIASES.department.includes(h)) &&
        normalized.some((h) => HEADER_ALIASES.icon.includes(h))
      );
    });

    const departmentEmbed = tableEmbed(departmentTable);
    if (departmentTable && departmentEmbed?.rows) {
      const headerIndex = buildHeaderIndex(departmentEmbed.headers || []);
      departments = departmentEmbed.rows
        .map((row) => {
          const deptName = cellByAliases(row, headerIndex, HEADER_ALIASES.department, 0);
          const iconUrl = resolveMediaUrl(
            cellByAliases(row, headerIndex, HEADER_ALIASES.icon, 1)
          );
          const nameBn = cellByAliases(row, headerIndex, HEADER_ALIASES.departmentBn, 2);
          return {
            name: deptName,
            name_bn: nameBn || getDefaultBengaliTranslation(deptName),
            icon: iconUrl,
          };
        })
        .filter((dept) => dept.name);
    }

    const doctorTable = doctorSection.data.find((component) => {
      const headers = tableEmbed(component)?.headers || [];
      return (
        component.type === "table" &&
        headers.some((h) => normalizeHeader(h) === "name")
      );
    });

    const doctorEmbed = tableEmbed(doctorTable);
    if (doctorTable && doctorEmbed?.rows) {
      const headerIndex = buildHeaderIndex(doctorEmbed.headers || []);
      // Legacy column order when headers are missing/renamed:
      // Body Part, Department, Name, Qualifications, Designation, Schedule, photo_link, ...
      const legacy = {
        bodyPart: 0,
        department: 1,
        name: 2,
        qualifications: 3,
        designation: 4,
        schedule: 5,
        photo: 6,
        bodyPartBn: 7,
        departmentBn: 8,
        nameBn: 9,
        qualificationsBn: 10,
        designationBn: 11,
        scheduleBn: 12,
      };

      // Current API often omits Body Part and starts at Department
      const currentNoBodyPart = !Object.keys(headerIndex).some((h) =>
        HEADER_ALIASES.bodyPart.includes(h)
      );
      if (currentNoBodyPart && headerIndex.name === 1) {
        legacy.department = 0;
        legacy.name = 1;
        legacy.qualifications = 2;
        legacy.designation = 3;
        legacy.schedule = 4;
        legacy.photo = 5;
        legacy.departmentBn = 6;
        legacy.nameBn = 7;
        legacy.qualificationsBn = 8;
        legacy.designationBn = 9;
        legacy.scheduleBn = 10;
        legacy.bodyPart = -1;
        legacy.bodyPartBn = -1;
      }

      doctors = doctorEmbed.rows
        .map((row, index) => {
          const name = cellByAliases(row, headerIndex, HEADER_ALIASES.name, legacy.name);
          if (!name) return null;

          const slug = createSlug(String(name));
          const uniqueId = createUniqueId(String(name), index);
          const imageUrl = resolveMediaUrl(
            cellByAliases(row, headerIndex, HEADER_ALIASES.photo, legacy.photo)
          );
          const department =
            cellByAliases(row, headerIndex, HEADER_ALIASES.department, legacy.department) ||
            "";
          const departmentBn =
            cellByAliases(row, headerIndex, HEADER_ALIASES.departmentBn, legacy.departmentBn) ||
            getDefaultBengaliTranslation(department);

          return {
            id: uniqueId,
            originalId: index + 1,
            name,
            name_bn:
              cellByAliases(row, headerIndex, HEADER_ALIASES.nameBn, legacy.nameBn) || name,
            slug,
            department,
            department_bn: departmentBn,
            qualifications:
              cellByAliases(
                row,
                headerIndex,
                HEADER_ALIASES.qualifications,
                legacy.qualifications
              ) || "",
            qualifications_bn:
              cellByAliases(
                row,
                headerIndex,
                HEADER_ALIASES.qualificationsBn,
                legacy.qualificationsBn
              ) || "",
            designation:
              cellByAliases(row, headerIndex, HEADER_ALIASES.designation, legacy.designation) ||
              "",
            designation_bn:
              cellByAliases(
                row,
                headerIndex,
                HEADER_ALIASES.designationBn,
                legacy.designationBn
              ) || "",
            schedule:
              cellByAliases(row, headerIndex, HEADER_ALIASES.schedule, legacy.schedule) || "",
            schedule_bn:
              cellByAliases(row, headerIndex, HEADER_ALIASES.scheduleBn, legacy.scheduleBn) ||
              "",
            image: imageUrl,
            bodyParts: splitBodyParts(
              cellByAliases(row, headerIndex, HEADER_ALIASES.bodyPart, legacy.bodyPart)
            ),
            bodyParts_bn: splitBodyParts(
              cellByAliases(row, headerIndex, HEADER_ALIASES.bodyPartBn, legacy.bodyPartBn)
            ),
          };
        })
        .filter(Boolean);

      const allBodyParts = doctors.flatMap((doctor) => doctor.bodyParts);
      bodyParts = [...new Set(allBodyParts)].filter(Boolean);

      const doctorDepartments = doctors.map((doctor) => ({
        name: doctor.department,
        name_bn: doctor.department_bn || getDefaultBengaliTranslation(doctor.department),
        icon: null,
      }));

      const existingDeptNames = departments.map((d) => d.name);
      const additionalDepartments = doctorDepartments.filter(
        (dept) => dept.name && !existingDeptNames.includes(dept.name)
      );

      departments = [...departments, ...additionalDepartments];
    }
  }

  return {
    departments,
    doctors,
    bodyParts,
  };
};

export const getDepartmentsByBodyPart = (doctors, bodyPart) => {
  if (!doctors || !bodyPart) return [];

  return doctors
    .filter((doctor) =>
      doctor.bodyParts.some(
        (part) =>
          part.toLowerCase().includes(bodyPart.toLowerCase()) ||
          bodyPart.toLowerCase().includes(part.toLowerCase())
      )
    )
    .map((doctor) => doctor.department)
    .filter((dept, index, arr) => arr.indexOf(dept) === index);
};

export const getDoctorsByDepartment = (doctors, department) => {
  if (!doctors || !department) return [];

  return doctors.filter((doctor) => doctor.department === department);
};

export const getDoctorsByBodyPart = (doctors, bodyPart) => {
  if (!doctors || !bodyPart) return [];

  return doctors.filter((doctor) =>
    doctor.bodyParts.some(
      (part) =>
        part.toLowerCase().includes(bodyPart.toLowerCase()) ||
        bodyPart.toLowerCase().includes(part.toLowerCase())
    )
  );
};

export const getDoctorsByBodyPartAndDepartment = (doctors, bodyPart, department) => {
  if (!doctors) return [];

  let filtered = doctors;
  if (department) {
    filtered = filtered.filter((doctor) => doctor.department === department);
  }
  if (bodyPart) {
    filtered = filtered.filter((doctor) =>
      doctor.bodyParts.some(
        (part) =>
          part.toLowerCase().includes(bodyPart.toLowerCase()) ||
          bodyPart.toLowerCase().includes(part.toLowerCase())
      )
    );
  }
  return filtered;
};
