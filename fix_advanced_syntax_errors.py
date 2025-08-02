#!/usr/bin/env python3
"""
Advanced syntax error fixer for Hospital Management System
This script fixes more complex syntax errors that the first script missed.
"""

import os
import re
import glob
from pathlib import Path

def fix_trailing_commas_in_declarations(content):
    """Fix trailing commas in variable declarations and other places"""
    # Fix patterns like: const queryParams: string[] = [],
    content = re.sub(r'(\w+:\s*[^=]+\[\]\s*=\s*\[[^\]]*\])\s*,\s*$', r'\1;', content, flags=re.MULTILINE)
    
    # Fix patterns like: const queryParams: string[] = [],
    content = re.sub(r'(const\s+\w+:\s*[^=]+\s*=\s*[^,;]+)\s*,\s*$', r'\1;', content, flags=re.MULTILINE)
    
    return content

def fix_double_from_imports(content):
    """Fix malformed import statements with double 'from'"""
    # Fix patterns like: } from "A" from "B";
    content = re.sub(r'(\}\s*from\s*["\'][^"\']*["\'])\s+from\s+["\'][^"\']*["\'];?', r'\1;', content)
    return content

def fix_incomplete_interfaces(content):
    """Fix incomplete interface definitions"""
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check for interface declaration without opening brace
        if re.match(r'^\s*interface\s+\w+\s*\{[^}]*$', line) and not line.strip().endswith('{'):
            # This interface declaration is missing proper structure
            if '{' in line:
                # Has opening brace but might be malformed
                # Look for the pattern: interface Name {property:type;
                match = re.match(r'(\s*interface\s+\w+\s*\{)([^}]+)$', line)
                if match:
                    interface_start = match.group(1)
                    properties = match.group(2)
                    # Add proper closing brace
                    fixed_lines.append(interface_start)
                    fixed_lines.append(f"  {properties.strip()}")
                    fixed_lines.append("}")
                else:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
        
        i += 1
    
    return '\n'.join(fixed_lines)

def fix_incomplete_function_calls(content):
    """Fix incomplete function calls like queryParams.push()"""
    # Fix patterns where function calls are missing arguments
    content = re.sub(r'\.push\(\)\s*;', '.push("");', content)
    return content

def fix_malformed_object_properties(content):
    """Fix malformed object properties"""
    # Fix patterns like: operations: {,
    content = re.sub(r'(\w+:\s*\{)\s*,', r'\1', content)
    return content

def fix_incomplete_type_definitions(content):
    """Fix incomplete type definitions"""
    # Fix patterns where interfaces are not properly closed
    lines = content.split('\n')
    fixed_lines = []
    in_interface = False
    brace_count = 0
    
    for line in lines:
        if 'interface ' in line and '{' in line:
            in_interface = True
            brace_count = line.count('{') - line.count('}')
        elif in_interface:
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0:
                in_interface = False
        
        # Fix malformed property definitions in interfaces
        if in_interface and ':' in line and not line.strip().endswith(';') and not line.strip().endswith(',') and not line.strip().endswith('{') and not line.strip().endswith('}'):
            if not line.strip().endswith(';'):
                line = line.rstrip() + ';'
        
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def fix_semicolon_instead_of_comma_in_objects(content):
    """Fix semicolons that should be commas in object literals"""
    # This is tricky - we need to be careful not to break actual statements
    # Look for patterns inside object literals
    
    # Fix patterns in object destructuring and object literals
    # Pattern: property: value; (when inside an object)
    lines = content.split('\n')
    fixed_lines = []
    in_object = False
    brace_count = 0
    
    for line in lines:
        # Track if we're inside an object literal
        if '{' in line:
            brace_count += line.count('{') - line.count('}')
            in_object = brace_count > 0
        elif '}' in line:
            brace_count += line.count('{') - line.count('}')
            in_object = brace_count > 0
        
        # If we're in an object and line looks like a property with semicolon
        if in_object and re.match(r'^\s*\w+\s*:\s*[^;]+;\s*$', line):
            # Check if this is likely a property (not a statement)
            if not any(keyword in line for keyword in ['if', 'for', 'while', 'return', 'throw', 'const', 'let', 'var']):
                line = re.sub(r';\s*$', ',', line)
        
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def process_file(file_path):
    """Process a single file to fix advanced syntax errors"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply fixes in order
        content = fix_trailing_commas_in_declarations(content)
        content = fix_double_from_imports(content)
        content = fix_incomplete_interfaces(content)
        content = fix_incomplete_function_calls(content)
        content = fix_malformed_object_properties(content)
        content = fix_incomplete_type_definitions(content)
        
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
    """Main function to fix advanced syntax errors"""
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