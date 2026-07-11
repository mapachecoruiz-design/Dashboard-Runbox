import fs from 'fs';

let content = fs.readFileSync('src/pages/Projections.tsx', 'utf8');
content = content.replace(
  "const { ufValue, clients, orders } = useAppContext();",
  "const { ufValue, clients, orders, tariffs } = useAppContext();"
);
fs.writeFileSync('src/pages/Projections.tsx', content);
