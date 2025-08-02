import { Project, SyntaxKind, TypeGuards } from 'ts-morph';
import path from 'path';

// Configuration
const EXCLUSIONS = [
    'node_modules',
    '.git',
    '*.test.*',
    '*.spec.*'
];

// Initialize project with proper error handling
try {
    const project = new Project({
        tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
        skipAddingFilesFromTsConfig: false,
        skipFileDependencyResolution: false,

    // Process files with enhanced error handling
    project.getSourceFiles().forEach(file => {
        const filePath = file.getFilePath();
        
        // Skip excluded files
        if (EXCLUSIONS.some(excl => filePath.includes(excl))) return;
        
        try {
            // Fix malformed imports with proper validation
            file.getImportDeclarations().forEach(imp => {
                const text = imp.getText();
                if (text.includes('import') && text.includes('}') && !text.includes('from')) {
                    const fixedText = text
                        .replace(/import\s*\{/g, 'import { ')
                        .replace(/\}\s*([^\s])/g, ' } from "@/lib/database"');
                    imp.replaceWithText(fixedText);
                }
            });
            
            // Fix malformed exports with proper validation
            file.getExportDeclarations().forEach(exp => {
                const text = exp.getText();
                if (text.includes('export') && text.includes('}') && !text.includes('from')) {
                    const fixedText = text
                        .replace(/export\s*\{/g, 'export { ')
                        .replace(/\}\s*([^\s])/g, ' }');
                    exp.replaceWithText(fixedText);
                }
            });
            
            // Additional syntax validation
            if (file.getSyntaxErrors().length > 0) {
                console.warn(`Syntax errors detected in ${filePath} - skipping further processing`);
                return;
            }
            
        } catch (error) { console.error(error); }:`, error);
            // Skip problematic files to prevent cascading errors
        }
    });
    
    // Save changes with validation
    project.saveSync();
    console.log('Import/export fixes completed with validation');
    
} catch (error) { console.error(error); }
