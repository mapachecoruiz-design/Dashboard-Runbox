const fs = require('fs');
const file = 'src/data/mockProjections.ts';
let code = fs.readFileSync(file, 'utf8');

// Match the array assignment
const regex = /export const initialProjectionsConfig: ClientProjectionConfig\[\] = (\[[\s\S]*?\]);/;
const match = code.match(regex);

if (match) {
    let configsStr = match[1];
    // Need to parse this safely or replace by mapping
    // We can evaluate it in a context if we mock the types, or just string replace.
    // Let's write a small script that replaces each object with the added fields.
}

