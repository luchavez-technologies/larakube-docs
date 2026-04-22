const fs = require('fs');
const path = require('path');

/**
 * LaraKube AI Context Generator (Node.js Edition)
 * Aggregates all documentation for LLM consumption.
 */

const DOCS_DIR = path.join(__dirname, 'docs');
const OUTPUT_FILE = path.join(__dirname, 'static', 'llms-full.txt');

console.log('🤖 Regenerating AI Master Context (Node.js)...');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const markdownFiles = getAllFiles(DOCS_DIR).filter(file => file.endsWith('.md')).sort();

let content = `# LaraKube CLI: Full Documentation Context\n\n`;
content += `> This file contains the complete LaraKube documentation for AI synthesis.\n\n`;
content += `> Generated on: ${new Date().toISOString()}\n\n`;

markdownFiles.forEach(file => {
  const relativePath = path.relative(__dirname, file);
  const fileContent = fs.readFileSync(file, 'utf8');
  
  content += `\n---\n`;
  content += `FILE: ${relativePath}\n`;
  content += `---\n\n`;
  content += fileContent + `\n`;
});

fs.writeFileSync(OUTPUT_FILE, content);

console.log(`✅ AI Context updated at: ${OUTPUT_FILE}`);
