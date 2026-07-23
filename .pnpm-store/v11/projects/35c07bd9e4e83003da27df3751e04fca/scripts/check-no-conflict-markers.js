#!/usr/bin/env node
/**
 * Check for Git conflict markers in codebase
 * Exits with code 1 if any conflict markers are found
 */

const fs = require('fs');
const path = require('path');

const conflictMarkers = [
  /^<<<<<<< /m,
  /^=======$/m,
  /^>>>>>>> /m,
];

const directoriesToCheck = [
  path.join(__dirname, '..', '..', 'supabase', 'sql'),
  path.join(__dirname, '..', 'src'),
  path.join(__dirname, '..', '..', 'docs'),
];

const fileExtensions = ['.sql', '.ts', '.tsx', '.js', '.jsx', '.md'];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    conflictMarkers.forEach((marker, markerIndex) => {
      if (marker.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          marker: markerIndex === 0 ? '<<<<<<<' : markerIndex === 1 ? '=======' : '>>>>>>>',
          content: line.trim(),
        });
      }
    });
  });

  return issues;
}

function checkDirectory(dirPath) {
  const issues = [];
  
  if (!fs.existsSync(dirPath)) {
    return issues;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .git
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') {
        continue;
      }
      issues.push(...checkDirectory(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (fileExtensions.includes(ext)) {
        issues.push(...checkFile(fullPath));
      }
    }
  }

  return issues;
}

// Main execution
const allIssues = [];

directoriesToCheck.forEach(dir => {
  const resolvedPath = path.resolve(dir);
  if (fs.existsSync(resolvedPath)) {
    allIssues.push(...checkDirectory(resolvedPath));
  }
});

if (allIssues.length > 0) {
  console.error('❌ Conflict markers found in codebase:');
  console.error('');
  allIssues.forEach(issue => {
    console.error(`  ${issue.file}:${issue.line}`);
    console.error(`    ${issue.marker}: ${issue.content}`);
  });
  console.error('');
  console.error('Please resolve all conflicts before committing.');
  process.exit(1);
} else {
  console.log('✅ No conflict markers found.');
  process.exit(0);
}

