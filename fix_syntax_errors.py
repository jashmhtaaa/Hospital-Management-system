#!/usr/bin/env python3
"""
Comprehensive syntax error fixer for Hospital Management System
This script fixes the widespread syntax errors in the codebase, particularly:
1. Trailing commas in function declarations (=> {,)
2. Other common syntax issues
"""

import os
import re
import glob
from pathlib import Path

def fix_trailing_comma_in_functions(content):
    """Fix trailing commas in function declarations like '=> {,'"""
    # Pattern to match function declarations with trailing comma
    pattern = r'(\s*=>\s*\{)\s*,\s*'
    replacement = r'\1'
    return re.sub(pattern, replacement, content)

def fix_object_literal_semicolons(content):
    """Fix semicolons that should be commas in object literals"""
    # This is more complex and needs careful handling
    # For now, let's focus on the most common patterns
    
    # Fix patterns like: property: value;
    # But be careful not to break actual statements
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # If line ends with semicolon and looks like object property
        if re.search(r'^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*[^;]+;\s*$', line):
            # Check if next line suggests we're in an object
            line = re.sub(r';\s*$', ',', line)
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def fix_empty_imports(content):
    """Fix empty import statements"""
    # Fix patterns like: import { } from "module"
    content = re.sub(r'import\s*\{\s*\}\s*from\s*["\'][^"\']*["\'];?', '', content)
    return content

def fix_malformed_exports(content):
    """Fix malformed export statements"""
    # Fix patterns like: export const _GET = ... (should be GET)
    content = re.sub(r'export\s+const\s+_([A-Z]+)\s*=', r'export const \1 =', content)
    return content

def process_file(file_path):
    """Process a single file to fix syntax errors"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply fixes
        content = fix_trailing_comma_in_functions(content)
        content = fix_empty_imports(content)
        content = fix_malformed_exports(content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to fix syntax errors across the codebase"""
    base_dir = Path('.')
    
    # Find all TypeScript and TSX files
    patterns = ['**/*.ts', '**/*.tsx']
    files_to_process = []
    
    for pattern in patterns:
        files_to_process.extend(glob.glob(pattern, recursive=True))
    
    # Filter out node_modules, .git, and backup directories
    files_to_process = [
        f for f in files_to_process 
        if not any(exclude in f for exclude in [
            'node_modules', '.git', '.backups', '.enterprise-backup', 
            'src_backup', 'coverage', 'dist', '.next'
        ])
    ]
    
    print(f"Found {len(files_to_process)} TypeScript files to process")
    
    fixed_count = 0
    for file_path in files_to_process:
        if process_file(file_path):
            fixed_count += 1
            print(f"Fixed: {file_path}")
    
    print(f"\nCompleted! Fixed {fixed_count} files out of {len(files_to_process)} total files.")

if __name__ == "__main__":
    main()