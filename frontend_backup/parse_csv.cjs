const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const inputFile = 'C:\\Users\\aksha\\Downloads\\universities_recovered.csv';
const outputFile = 'src/lib/universitiesData.ts';

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (data) => {
    if (!data.name) return;
    
    // Parse cost of attendance by removing $ and commas
    let cost = data.cost_of_attendance ? parseInt(data.cost_of_attendance.replace(/[^0-9]/g, ''), 10) : undefined;
    if (isNaN(cost)) cost = undefined;

    // Parse programs
    let programs = data.anchor_programs ? data.anchor_programs.split(',').map(p => p.trim()) : [];
    
    results.push({
      id: 'u_' + data.rank,
      name: data.name.trim(),
      country: 'United States', // CSV mostly seems to be US
      city: data.town ? data.town.trim() : 'Unknown',
      logo_url: data.logo_url ? data.logo_url.trim() : '',
      ranking: parseInt(data.rank) || undefined,
      description: `A ${data.classification ? data.classification.toLowerCase() : 'higher education'} institution located in ${data.town}, ${data.state}.`,
      university_type: data.classification ? data.classification.toLowerCase() : 'public',
      qs_rank: parseInt(data.rank) || undefined,
      cost_of_attendance: cost,
      programs: programs,
      scholarships_available: true,
      created_at: new Date().toISOString()
    });
  })
  .on('end', () => {
    const fileContent = `import type { University } from '@/types';\n\nexport const REAL_UNIVERSITIES: University[] = ${JSON.stringify(results, null, 2)};\n`;
    fs.writeFileSync(outputFile, fileContent);
    console.log('Successfully wrote', results.length, 'universities to', outputFile);
  });
