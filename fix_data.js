const fs = require('fs');

const filePath = 'd:/Mentoring Path/frontend/src/lib/universitiesData.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// The file exports REAL_UNIVERSITIES = [ ... ]
// Let's just use string replacement and JSON parsing where possible, or just string replace.
// Or better, let's extract the array, parse it, modify it, and write it back.

const arrayStartIndex = content.indexOf('[');
const arrayEndIndex = content.lastIndexOf(']') + 1;

if (arrayStartIndex === -1 || arrayEndIndex === 0) {
  console.error("Could not find array bounds");
  process.exit(1);
}

const beforeArray = content.substring(0, arrayStartIndex);
const arrayStr = content.substring(arrayStartIndex, arrayEndIndex);
const afterArray = content.substring(arrayEndIndex);

let data;
try {
  data = JSON.parse(arrayStr);
} catch(e) {
  // If there are trailing commas or something, parsing might fail, but let's see.
  // We can try to use `eval` securely since we control the file
  try {
    data = eval(`(${arrayStr})`);
  } catch(e2) {
    console.error("Failed to parse array", e2);
    process.exit(1);
  }
}

console.log("Loaded array of length: " + data.length);

const seenNames = new Set();
const toKeep = [];

for (let item of data) {
  // Fix encoding issues globally across strings
  if (item.name) {
    item.name = item.name.replace(/â€“/g, '–').replace(/â€”/g, '—').replace(/Ã©/g, 'é');
  }
  if (item.description) {
    item.description = item.description.replace(/â€“/g, '–').replace(/â€”/g, '—').replace(/Ã©/g, 'é');
  }

  // Ambiguities & Scope Issues
  if (item.name === 'Aquinas College') {
    if (item.city === 'Grand Rapids') {
      item.name = 'Aquinas College (Grand Rapids, MI)';
    } else if (item.city === 'Nashville') {
      item.name = 'Aquinas College (Nashville, TN)';
    }
  }

  if (item.name.startsWith('Antioch University ')) {
    // Drop branches
    continue;
  }

  // Duplicate Entries check
  // The user says "Wheaton College (Massachusetts) (Repeated twice)"
  // But wait, it's just "Wheaton College" and "Wheaton College, Massachusetts" maybe?
  // Let's normalize the name for duplicate detection
  let checkName = item.name;
  if (item.name === 'Wheaton College, Massachusetts') checkName = 'Wheaton College';
  
  if (seenNames.has(checkName)) {
    console.log("Removing duplicate: " + item.name);
    continue;
  }

  seenNames.add(checkName);
  toKeep.push(item);
}

const newArrayStr = JSON.stringify(toKeep, null, 2);
const newContent = beforeArray + newArrayStr + afterArray;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Successfully wrote " + toKeep.length + " items.");
