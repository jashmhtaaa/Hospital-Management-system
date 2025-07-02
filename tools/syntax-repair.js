#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Automated Syntax Repair Tool for HMS
 * Fixes common TypeScript syntax errors
 */

class SyntaxRepairer {
  constructor() {
    this.fixedFiles = 0;
    this.totalErrors = 0;
    this.logFile = 'syntax-repair.log';
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, `${new Date().toISOString()}: ${message}\n`);
  }

  /**
   * Fix common syntax patterns
   */
  repairContent(content, filePath) {
    let fixed = content;
    let errorCount = 0;

    // 1. Fix object properties: semicolon to comma
    const semicolonMatches = fixed.match(/(\w+):\s*[^,;{}]+;(?=\s*[\w}])/g);
    if (semicolonMatches) {
      semicolonMatches.forEach(match => {
        const corrected = match.replace(/;$/, ',');
        fixed = fixed.replace(match, corrected);
        errorCount++;
      });
    }

    // 2. Fix missing commas in object/array literals
    const missingCommaMatches = fixed.match(/([^,\s])\s*\n\s*(\w+:|[\w\d_$]+:)/g);
    if (missingCommaMatches) {
      missingCommaMatches.forEach(match => {
        const corrected = match.replace(/(\w)\s*\n(\s*)(\w)/, '$1,\n$2$3');
        fixed = fixed.replace(match, corrected);
        errorCount++;
      });
    }

    // 3. Fix enum definitions
    fixed = fixed.replace(/export\s*=\s*"export"\s*enum\s*=\s*"enum"\s*(\w+)\s*=\s*"(\w+)"/g, 'export enum $1');

    // 4. Fix interface definitions  
    fixed = fixed.replace(/export\s*=\s*"export"\s*interface\s*=\s*"interface"\s*(\w+)\s*=\s*"(\w+)"/g, 'export interface $1');

    // 5. Fix import statements
    fixed = fixed.replace(/import\s+([^}]+)\s+}\s*import\s+([^{]+)\s*{/g, 'import { $1, $2 }');
    
    // 6. Fix malformed imports
    fixed = fixed.replace(/import\s+"([^"]+)"\s*import\s+([^}]+)\s+}/g, 'import { $2 } from "$1"');

    // 7. Fix array type declarations
    fixed = fixed.replace(/(\w+)\?\s*:\s*(\w+)\[\];/g, '$1?: $2[],');

    // 8. Fix enum member syntax
    fixed = fixed.replace(/(\w+)\s*=\s*"(\w+)"\s*;/g, '$1 = "$2",');

    // 9. Fix malformed object literals
    fixed = fixed.replace(/{\s*(\w+):\s*([^,}]+);\s*([^}]*)\s*}/g, '{ $1: $2, $3 }');

    // 10. Fix method parameter types
    fixed = fixed.replace(/\(\s*(\w+):\s*([^)]+);\s*([^)]*)\)/g, '($1: $2, $3)');

    return { content: fixed, errorCount };
  }

  /**
   * Process a single file
   */
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: fixedContent, errorCount } = this.repairContent(content, filePath);

      if (errorCount > 0) {
        // Backup original file
        const backupPath = filePath + '.backup';
        fs.writeFileSync(backupPath, content);

        // Write fixed content
        fs.writeFileSync(filePath, fixedContent);
        
        this.fixedFiles++;
        this.totalErrors += errorCount;
        this.log(`✅ Fixed ${errorCount} errors in ${filePath}`);
      }
    } catch (error) {
      this.log(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Process all files in the project
   */
  async run() {
    this.log('🚀 Starting Automated Syntax Repair...');
    
    // Clear log file
    fs.writeFileSync(this.logFile, '');

    // File patterns to process
    const patterns = [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.test.ts',
      '!src/**/*.spec.ts',
      '!node_modules/**',
      '!.next/**',
      '!dist/**',
      '!build/**'
    ];

    // Get all files
    const files = [];
    for (const pattern of patterns) {
      if (pattern.startsWith('!')) {
        continue; // Skip exclusions for now
      }
      const matchedFiles = glob.sync(pattern);
      files.push(...matchedFiles);
    }

    // Remove duplicates and excluded paths
    const uniqueFiles = [...new Set(files)].filter(file => 
      !file.includes('node_modules') &&
      !file.includes('.next') &&
      !file.includes('dist') &&
      !file.includes('build') &&
      !file.includes('.test.') &&
      !file.includes('.spec.')
    );

    this.log(`📁 Found ${uniqueFiles.length} files to process`);

    // Process files
    uniqueFiles.forEach(file => this.processFile(file));

    // Summary
    this.log('');
    this.log('📊 REPAIR SUMMARY:');
    this.log(`✅ Files processed: ${uniqueFiles.length}`);
    this.log(`🔧 Files fixed: ${this.fixedFiles}`);
    this.log(`🐛 Total errors fixed: ${this.totalErrors}`);
    this.log(`📄 Log file: ${this.logFile}`);
    
    if (this.fixedFiles > 0) {
      this.log('');
      this.log('⚠️  BACKUP FILES CREATED - Original files backed up with .backup extension');
      this.log('🔍 Please review changes and run tests before committing');
    }
  }
}

// Run the repair tool
if (require.main === module) {
  const repairer = new SyntaxRepairer();
  repairer.run().catch(console.error);
}

module.exports = SyntaxRepairer;