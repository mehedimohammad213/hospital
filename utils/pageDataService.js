// Utility service to extract and process data from page API response

const tableEmbed = (component) => component?._headless ?? component?._mave;

// Helper function to create consistent slugs
export const createSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
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
    "Ultrasonography": "আল্ট্রাসনোগ্রাফি",
    "Food and nutrition specialist": "খাদ্য ও পুষ্টি বিশেষজ্ঞ",
    "Dermatology & Venereology": "চর্ম ও যৌনরোগ",
    "Nephrology": "নেফ্রোলজি (কিডনি)",
    "Cardiology": "কার্ডিওলজি (হৃদরোগ)",
    "ENT": "ইএনটি (কান-নাক-গলা)",
    "Pediatrics & NICU": "শিশুরোগ ও এনআইসিইউ",
    "Orthopaedic": "অর্থোপেডিক্স",
    "Gynae & OBS": "গাইনি ও প্রসূতি",
    "Anesthesia": "অ্যানেস্থেসিয়া",
    "General Surgery": "সাধারণ সার্জারি",
    "Medicine": "মেডিসিন"
  };

  return translations[departmentName] || departmentName;
};

export const extractBodyPartsAndDepartments = (pageData) => {
  if (!pageData || !pageData.body) {
    return {
      departments: [],
      doctors: [],
      bodyParts: []
    };
  }

  let departments = [];
  let doctors = [];
  let bodyParts = [];

  // Find the section with doctor data (Section 8)
  const doctorSection = pageData.body.find(section =>
    section.title === "Section 8" ||
    section.data?.some(component => component.type === "table")
  );

  if (doctorSection) {
    // Extract departments from the first table
    const departmentTable = doctorSection.data.find(component =>
      component.type === "table" &&
      tableEmbed(component)?.headers?.includes("department_name")
    );

    const departmentEmbed = tableEmbed(departmentTable);
    if (departmentTable && departmentEmbed?.rows) {
      console.log('🏥 Processing Department Icons:');
      departments = departmentEmbed.rows.map((row, index) => {
        const deptName = row[0];
        const iconUrl = row[1] || null;

        // Debug department icons
        console.log(`🏢 Department ${index + 1}: ${deptName}`);
        console.log(`🖼️  Raw icon_link: ${row[1]}`);
        console.log(`✅ Processed icon URL: ${iconUrl}`);
        console.log(`🔗 Full icon URL: ${iconUrl ? iconUrl : 'No icon'}`);
        console.log('---');

        return {
          name: deptName,
          name_bn: row[2], // Bengali name from department_name_BN column
          icon: iconUrl
        };
      });
      console.log('📋 Final departments with icons:', departments);
    }

    // Extract doctors from the second table
    const doctorTable = doctorSection.data.find(component =>
      component.type === "table" &&
      tableEmbed(component)?.headers?.includes("Name")
    );

    const doctorEmbed = tableEmbed(doctorTable);
    if (doctorTable && doctorEmbed?.rows) {
      doctors = doctorEmbed.rows.map((row, index) => {
        const name = row[2];
        const slug = createSlug(name);
        const uniqueId = createUniqueId(name, index);
        const imageUrl = row[6] || null;

        // Debug photo URLs
        console.log(`📸 Doctor ${index + 1}: ${name}`);
        console.log(`🖼️  Raw photo_link: ${row[6]}`);
        console.log(`✅ Processed image URL: ${imageUrl}`);
        console.log(`🔗 Full image URL: ${imageUrl ? imageUrl : 'No image'}`);
        console.log('---');

        return {
          id: uniqueId, // Unique ID
          originalId: index + 1,
          name: name,
          name_bn: row[9] || name, // Bengali name
          slug: slug, // URL-friendly slug
          department: row[1], // Department
          department_bn: row[8] || row[1], // Bengali department
          qualifications: row[3], // Qualifications
          qualifications_bn: row[10] || row[3], // Bengali qualifications
          designation: row[4], // Designation
          designation_bn: row[11] || row[4], // Bengali designation
          schedule: row[5], // Schedule
          schedule_bn: row[12] || row[5], // Bengali schedule
          image: imageUrl, // photo_link
          bodyParts: row[0] ? row[0].split(', ').map(part => part.trim()) : [], // Body Part
          bodyParts_bn: row[7] ? row[7].split(', ').map(part => part.trim()) : [] // Bengali Body Part
        };
      });

      // Extract unique body parts
      const allBodyParts = doctors.flatMap(doctor => doctor.bodyParts);
      bodyParts = [...new Set(allBodyParts)].filter(Boolean);

      // Extract additional departments from doctor table that might not be in department table
      const doctorDepartments = doctors.map(doctor => ({
        name: doctor.department,
        name_bn: doctor.department_bn || getDefaultBengaliTranslation(doctor.department),
        icon: null // No icon for doctor-extracted departments
      }));

      // Merge departments from both sources, avoiding duplicates
      const existingDeptNames = departments.map(d => d.name);
      const additionalDepartments = doctorDepartments.filter(dept =>
        !existingDeptNames.includes(dept.name)
      );

      // Combine all departments
      departments = [...departments, ...additionalDepartments];
    }
  }

  // Final debug summary
  console.log('🎯 FINAL PROCESSED DATA SUMMARY:');
  console.log(`📊 Total Departments: ${departments.length}`);
  console.log(`👨‍⚕️ Total Doctors: ${doctors.length}`);
  console.log(`🔧 Total Body Parts: ${bodyParts.length}`);

  // Debug sample data
  if (departments.length > 0) {
    console.log('🏥 Sample Department:', departments[0]);
  }
  if (doctors.length > 0) {
    console.log('👨‍⚕️ Sample Doctor:', {
      name: doctors[0].name,
      department: doctors[0].department,
      image: doctors[0].image
    });
  }

  console.log('✅ Data extraction completed successfully!');

  return {
    departments,
    doctors,
    bodyParts
  };
};

export const getDepartmentsByBodyPart = (doctors, bodyPart) => {
  if (!doctors || !bodyPart) return [];

  return doctors
    .filter(doctor =>
      doctor.bodyParts.some(part =>
        part.toLowerCase().includes(bodyPart.toLowerCase()) ||
        bodyPart.toLowerCase().includes(part.toLowerCase())
      )
    )
    .map(doctor => doctor.department)
    .filter((dept, index, arr) => arr.indexOf(dept) === index); // Remove duplicates
};

export const getDoctorsByDepartment = (doctors, department) => {
  if (!doctors || !department) return [];

  return doctors.filter(doctor => doctor.department === department);
};

export const getDoctorsByBodyPart = (doctors, bodyPart) => {
  if (!doctors || !bodyPart) return [];

  return doctors.filter(doctor =>
    doctor.bodyParts.some(part =>
      part.toLowerCase().includes(bodyPart.toLowerCase()) ||
      bodyPart.toLowerCase().includes(part.toLowerCase())
    )
  );
};

export const getDoctorsByBodyPartAndDepartment = (doctors, bodyPart, department) => {
  if (!doctors) return [];

  let filteredDoctors = doctors;

  if (bodyPart) {
    filteredDoctors = getDoctorsByBodyPart(filteredDoctors, bodyPart);
  }

  if (department) {
    filteredDoctors = getDoctorsByDepartment(filteredDoctors, department);
  }

  return filteredDoctors;
};
