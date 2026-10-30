import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read full universities data
const fullData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'lib', 'universitiesFull.json'), 'utf8')
);

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/institutions', priority: '0.9', changefreq: 'daily' },
  { path: '/mentors', priority: '0.9', changefreq: 'daily' },
  { path: '/research-areas', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/verification', priority: '0.6', changefreq: 'monthly' },
  { path: '/roadmaps', priority: '0.7', changefreq: 'weekly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/accessibility', priority: '0.3', changefreq: 'yearly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static pages
for (const route of staticRoutes) {
  xml += `  <url>
    <loc>https://campusarge.com${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
}

// Institution pages (u_1 ... u_426)
for (const uni of fullData) {
  xml += `  <url>
    <loc>https://campusarge.com/institutions/${uni.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

xml += `</urlset>
`;

const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Generated ${sitemapPath} with ${staticRoutes.length + fullData.length} URLs (Static: ${staticRoutes.length}, Institutions: ${fullData.length})`);

// robots.txt
const robotsContent = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

Sitemap: https://campusarge.com/sitemap.xml
`;

const robotsPath = path.join(projectRoot, 'public', 'robots.txt');
fs.writeFileSync(robotsPath, robotsContent, 'utf8');
console.log(`Generated ${robotsPath}`);

