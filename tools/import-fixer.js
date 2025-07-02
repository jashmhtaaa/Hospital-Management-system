#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

/**
 * Import Statement Repair Tool for HMS
 * Fixes malformed import statements
 */

class ImportFixer {
  constructor() {
    this.fixedFiles = 0;
    this.totalFixes = 0;
  }

  log(message) {
    console.log(message);
  }

  fixImports(content) {
    let fixed = content;
    let fixCount = 0;

    // Pattern 1: import { "path" -> import { something } from "path"
    fixed = fixed.replace(/import\s*{\s*"([^"]+)"/g, 'import { } from "$1"');
    if (fixed !== content) fixCount++;

    // Pattern 2: import { something } from "path" from "anotherpath" -> import { something } from "path"  
    fixed = fixed.replace(/import\s*{([^}]+)}\s*from\s*"([^"]+)"\s*from\s*"[^"]*"/g, 'import {$1} from "$2"');
    if (fixed !== content) fixCount++;

    // Pattern 3: import "./path" -> proper import
    fixed = fixed.replace(/^import\s+"([^"]+)"\s*$/gm, 'import "$1";');
    if (fixed !== content) fixCount++;

    // Pattern 4: Fix duplicate import patterns
    fixed = fixed.replace(/import\s+([^{]+)\s+}\s*import\s+([^{]+)\s*{/g, 'import { $1, $2 }');
    if (fixed !== content) fixCount++;

    // Pattern 5: Remove duplicated words in imports
    fixed = fixed.replace(/import\s*{\s*{\s*([^}]+)\s*}\s*}/g, 'import { $1 }');
    if (fixed !== content) fixCount++;

    // Pattern 6: Fix enum/interface declaration in imports  
    fixed = fixed.replace(/import\s*{\s*(export\s+(?:enum|interface)\s+\w+)\s*}/g, '$1');
    if (fixed !== content) fixCount++;

    // Pattern 7: Fix array bracket issues
    fixed = fixed.replace(/(\w+)\?\s*:\s*(\w+)\[\]\s*,\s*\n/g, '$1?: $2[];\n');
    if (fixed !== content) fixCount++;

    // Pattern 8: Fix object property syntax in interfaces
    fixed = fixed.replace(/export interface (\w+) \{(\w+):(\w+),/g, 'export interface $1 {\n  $2: $3;');
    if (fixed !== content) fixCount++;

    return { content: fixed, fixCount };
  }

  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: fixedContent, fixCount } = this.fixImports(content);

      if (fixCount > 0) {
        fs.writeFileSync(filePath, fixedContent);
        this.fixedFiles++;
        this.totalFixes += fixCount;
        this.log(`✅ Fixed ${fixCount} import errors in ${filePath}`);
      }
    } catch (error) {
      this.log(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  async run() {
    this.log('🔧 Starting Import Statement Repair...');

    // Get TypeScript files
    const files = glob.sync('src/**/*.{ts,tsx}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
    });

    this.log(`📁 Found ${files.length} TypeScript files`);

    // Process files
    files.forEach(file => this.processFile(file));

    // Summary
    this.log('');
    this.log('📊 IMPORT REPAIR SUMMARY:');
    this.log(`✅ Files processed: ${files.length}`);
    this.log(`🔧 Files fixed: ${this.fixedFiles}`);
    this.log(`🐛 Total import fixes: ${this.totalFixes}`);
  }
}

// Run the import fixer
if (require.main === module) {
  const fixer = new ImportFixer();
  fixer.run().catch(console.error);
}

module.exports = ImportFixer;