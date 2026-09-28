const fs = require('fs');
const path = require('path');

const directory = './src';

const modifications = [];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function migrateColors() {
    walkDir(directory, function(filePath) {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        // Match Tailwind utility classes related to colors
        const primaryRegex = /(hover:|focus:|dark:)?(text|bg|border|from|to|via|ring|shadow|fill|stroke)-primary-[0-9]{2,3}(\/[0-9]{1,2})?/g;
        const accentRegex = /(hover:|focus:|dark:)?(text|bg|border|from|to|via|ring|shadow|fill|stroke)-accent-[0-9]{2,3}(\/[0-9]{1,2})?/g;

        let match;
        while ((match = primaryRegex.exec(content)) !== null) {
            let proposed = match[0];
            // Primary usually translates to navy (darker, primary button) or blue (links, accents)
            // Let's use navy for bg, text, border
            proposed = proposed.replace(/primary-[0-9]{2,3}/, 'navy');
            
            // if it had an opacity like /20, map to our -light variant if it's a background
            if (proposed.includes('/')) {
                if (proposed.includes('bg-')) {
                    proposed = proposed.replace(/navy\/[0-9]{1,2}/, 'navy-light');
                } else {
                    // strip opacity for text/border as we don't have them in tokens
                    proposed = proposed.replace(/\/[0-9]{1,2}/, '');
                }
            }
            
            modifications.push({
                file: filePath,
                original: match[0],
                proposed: proposed
            });
        }
        
        while ((match = accentRegex.exec(content)) !== null) {
            let replacementColor = 'burgundy';
            
            const start = Math.max(0, match.index - 80);
            const end = Math.min(content.length, match.index + 80);
            const context = content.substring(start, end).toLowerCase();
            
            // Semantic checks
            if (context.includes('success') || context.includes('verified') || context.includes('check') || context.includes('approve')) {
                replacementColor = 'green-600'; // use standard tailwind green
                if (match[0].includes('bg-') && match[0].includes('/')) {
                    replacementColor = 'green-100'; // light background
                }
            } else if (context.includes('warning') || context.includes('pending')) {
                replacementColor = 'amber-500';
            } else if (context.includes('error') || context.includes('danger') || context.includes('reject')) {
                replacementColor = 'red-500';
            } else if (context.includes('gold') || context.includes('star') || context.includes('premium')) {
                replacementColor = 'gold';
            }
            
            let proposed = match[0].replace(/accent-[0-9]{2,3}/, replacementColor);
            
            if (proposed.includes('/') && !proposed.includes('green-100')) {
                if (proposed.includes('bg-')) {
                    proposed = proposed.replace(new RegExp(`${replacementColor}\/[0-9]{1,2}`), `${replacementColor}-light`);
                } else {
                    proposed = proposed.replace(/\/[0-9]{1,2}/, '');
                }
            }
            
            modifications.push({
                file: filePath,
                original: match[0],
                proposed: proposed
            });
        }
    });
    
    const byFile = modifications.reduce((acc, mod) => {
        acc[mod.file] = acc[mod.file] || [];
        acc[mod.file].push(mod);
        return acc;
    }, {});
    
    console.log("=== DRY RUN SUMMARY ===");
    for (const file in byFile) {
        console.log(`\nFile: ${file}`);
        const changes = {};
        byFile[file].forEach(mod => {
            const key = `${mod.original} -> ${mod.proposed}`;
            changes[key] = (changes[key] || 0) + 1;
        });
        for (const change in changes) {
            console.log(`  ${change} (x${changes[change]})`);
        }
    }
}

migrateColors();
