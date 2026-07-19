const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

const requiredDocs = [
  'AGENTS.md',
  'web/docs/DEVELOPER_OPERATING_MODEL.md',
  'web/docs/EMBER_BRAND_BOOK.md',
  'web/docs/CONSCIENTIOUS_CONOR.md',
  'web/docs/PRODUCT_MARKETING_LIBRARY.md',
  '.cursor/rules/conscientious-conor.mdc',
];

const missing = requiredDocs.filter((relativePath) => {
  const absolutePath = path.join(repoRoot, relativePath);
  return !fs.existsSync(absolutePath);
});

if (missing.length > 0) {
  console.error('Missing required Ember documentation:');
  for (const relativePath of missing) console.error(`- ${relativePath}`);
  console.error('\nRestore required docs before building or shipping parent-facing work.');
  process.exit(1);
}

console.log(`Required Ember docs present (${requiredDocs.length}).`);
