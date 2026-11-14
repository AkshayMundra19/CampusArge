import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export function getSlug(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// 1. Update universitiesFull.json
const fullPath = path.join(projectRoot, 'src', 'lib', 'universitiesFull.json');
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
full.forEach(u => {
  u.slug = getSlug(u.name);
});
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2), 'utf8');
console.log(`Updated universitiesFull.json with ${full.length} slugs`);

// 2. Update universitiesIndex.ts
const indexPath = path.join(projectRoot, 'src', 'lib', 'universitiesIndex.ts');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Regex to match "id": "u_...", "name": "..."
const regex = /"id":\s*"(u_\d+)",\s*\n\s*"name":\s*"([^"]+)"/g;
indexContent = indexContent.replace(regex, (match, id, name) => {
  const slug = getSlug(name);
  return `"id": "${id}",\n    "slug": "${slug}",\n    "name": "${name}"`;
});

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated universitiesIndex.ts with slugs');

