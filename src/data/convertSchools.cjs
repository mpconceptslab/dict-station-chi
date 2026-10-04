// Script to convert school CSV to TypeScript
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'schoolList.csv');
const tsPath = path.join(__dirname, 'schoolListData.ts');

const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.trim().split('\n');

// Parse CSV
const schools = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Handle quoted fields with commas
  const matches = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      matches.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  matches.push(current.trim());
  
  if (matches.length >= 8) {
    schools.push({
      nature: matches[0],
      natureChi: matches[1],
      plan: matches[2],
      planChi: matches[3],
      name: matches[4],
      nameChi: matches[5],
      district: matches[6],
      districtChi: matches[7]
    });
  }
}

// Get unique districts
const districts = [...new Set(schools.map(s => s.districtChi))].sort();

// Get unique plans (natures)
const plans = [...new Set(schools.map(s => s.planChi))];

// Group schools by district and plan
const grouped = {};
schools.forEach(s => {
  if (!grouped[s.districtChi]) grouped[s.districtChi] = {};
  if (!grouped[s.districtChi][s.planChi]) grouped[s.districtChi][s.planChi] = [];
  grouped[s.districtChi][s.planChi].push({
    name: s.nameChi,
    nameEn: s.name
  });
});

// Generate TypeScript
let ts = `// Auto-generated school list data from CSV
// Structure: District → Nature → Schools

export interface School {
  name: string;
  nameEn: string;
}

export const HK_SCHOOL_DISTRICTS: string[] = ${JSON.stringify(districts, null, 2)};

export const SCHOOL_NATURES: string[] = ${JSON.stringify(plans, null, 2)};

export const HK_SCHOOLS: Record<string, Record<string, School[]>> = ${JSON.stringify(grouped, null, 2)};

export const NON_HK_SCHOOL_OPTION = 'non-hk';
`;

fs.writeFileSync(tsPath, ts);
console.log(`Generated ${tsPath} with ${schools.length} schools`);
