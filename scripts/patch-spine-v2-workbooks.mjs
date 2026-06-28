/**
 * Patch discover_projection.category_entity_id in Spine 2.0 G Drive workbooks.
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { SOURCE_DIR, SOURCE_FILES, proposeCanonical } from './spine-v2-slug-canonical.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BACKUP_DIR = path.join(ROOT, 'agent-tools/backups/spine-v2-workbooks-pre-slug-cleanup');

let changedCells = 0;
let changedFiles = 0;

fs.mkdirSync(BACKUP_DIR, { recursive: true });

for (const { file } of SOURCE_FILES) {
  const filePath = path.join(SOURCE_DIR, file);
  const backupPath = path.join(BACKUP_DIR, file);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets.discover_projection;
  if (!sheet) throw new Error(`Missing discover_projection in ${file}`);

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  let fileChanges = 0;
  for (const row of rows) {
    const before = String(row.category_entity_id || '').trim();
    const after = proposeCanonical(before);
    if (before && after !== before) {
      row.category_entity_id = after;
      fileChanges++;
    }
  }

  if (fileChanges > 0) {
    const newSheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
    wb.Sheets.discover_projection = newSheet;
    XLSX.writeFile(wb, filePath);
    changedFiles++;
    changedCells += fileChanges;
  }

  console.log(`${file}: ${fileChanges} category_entity_id cells updated`);
}

console.log(JSON.stringify({ changedFiles, changedCells, backupDir: BACKUP_DIR }, null, 2));
