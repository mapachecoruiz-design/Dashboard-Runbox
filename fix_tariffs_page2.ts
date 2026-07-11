import fs from 'fs';

let content = fs.readFileSync('src/pages/Tariffs.tsx', 'utf8');
content = content.replace(/\\\$\{/g, "${");
fs.writeFileSync('src/pages/Tariffs.tsx', content);
