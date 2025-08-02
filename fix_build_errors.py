#!/usr/bin/env python3
"""
Automated Build Error Fixer for Hospital Management System
Identifies and fixes common build-breaking syntax errors
"""

import os
import re
import subprocess
from pathlib import Path

def run_build_and_get_errors():
    """Run build and extract error information"""
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'], 
            capture_output=True, 
            text=True, 
            cwd='/workspace/project/Hospital-Management-system'
        )
        return result.stderr + result.stdout
    except Exception as e:
        return str(e)

def fix_common_syntax_errors(file_path):
    """Fix common syntax errors in a file"""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        original_content = content
        
        # Fix common patterns
        fixes = [
            # Fix missing closing braces in object literals
            (r'(\w+):\s*},\s*$', r'\1 },'),
            # Fix malformed catch blocks
            (r'}\s*catch\s*\(\s*error\s*\)\s*{\s*console\.error\(\s*error\s*\);\s*}', 
             '} catch (error) {\n    console.error(error);\n  }'),
            # Fix incomplete object literals
            (r'{\s*(\w+):\s*$', r'{ \1: null'),
            # Fix missing semicolons in return statements
            (r'return\s+([^;]+)$', r'return \1;'),
            # Fix malformed function declarations
            (r'async\s+const\s+(\w+)\s*=', r'const \1 = async'),
        ]
        
        for pattern, replacement in fixes:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
        
        if content != original_content:
            with open(file_path, 'w') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def main():
    print("🔧 AUTOMATED BUILD ERROR FIXER")
    print("==============================")
    
    # Get initial build errors
    build_output = run_build_and_get_errors()
    
    if "Failed to compile" not in build_output:
        print("✅ Build is already passing!")
        return
    
    # Extract file paths with errors
    error_files = re.findall(r'\./([^:\s]+\.tsx?)', build_output)
    error_files = list(set(error_files))  # Remove duplicates
    
    print(f"Found {len(error_files)} files with build errors")
    
    fixed_count = 0
    for file_path in error_files[:10]:  # Fix first 10 files
        full_path = f"/workspace/project/Hospital-Management-system/{file_path}"
        if os.path.exists(full_path):
            if fix_common_syntax_errors(full_path):
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            else:
                print(f"⚠️ No fixes applied: {file_path}")
    
    print(f"\n📊 Summary: {fixed_count} files fixed")
    
    # Test build again
    print("\n🔄 Testing build after fixes...")
    new_build_output = run_build_and_get_errors()
    
    if "Failed to compile" not in new_build_output:
        print("🎉 BUILD NOW PASSES!")
    else:
        remaining_errors = len(re.findall(r'Error:', new_build_output))
        print(f"⚠️ {remaining_errors} errors remain")

if __name__ == '__main__':
    main()
