"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const projectRoot = '/root/Hospital-Management-System';
const project = new ts_morph_1.Project({
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
});
// Read structured faults from stdin (or a file if preferred)
const faultsJson = fs.readFileSync('/dev/stdin', 'utf8'); // Assuming input from pipe or file
const structuredFaults = JSON.parse(faultsJson);
const filesToProcess = new Set();
structuredFaults.forEach((fault) => {
    filesToProcess.add(fault.filePath);
});
filesToProcess.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        project.addSourceFileAtPath(filePath);
    }
    else {
        console.warn(`Warning: File not found at path: ${filePath}`);
    }
});
console.log(`Processing ${filesToProcess.size} files for fixes.`);
structuredFaults.forEach((fault) => {
    const sourceFile = project.getSourceFile(fault.filePath);
    if (!sourceFile) {
        console.warn(`Could not find source file for fault: ${fault.filePath}`);
        return;
    }
    // Strategy: Fix malformed import statements (TS2304 - Cannot find name)
    if (fault.code === 2304 && fault.message.startsWith("Cannot find name '")) {
        const missingName = fault.text; // The name that cannot be found
        console.log(`Attempting to fix missing name '${missingName}' in ${fault.filePath} at line ${fault.lineNumber}`);
        // Find the problematic import declaration near the error location
        // This is a heuristic and might need refinement
        const importDeclarations = sourceFile.getImportDeclarations();
        let foundAndFixed = false;
        for (const importDecl of importDeclarations) {
            const importText = importDecl.getText();
            // Heuristic: if the import text contains the missing name and looks malformed
            // This is a very basic check, will need to be more robust
            if (importText.includes(missingName) &&
                (importText.includes('}') && !importText.includes('{')) || // Missing opening brace
                (!importText.includes('}') && importText.includes('{')) || // Missing closing brace
                importText.includes('from') && !importText.includes('"') // Missing quotes around module specifier
            ) {
                console.log(`Found potentially malformed import: ${importText}`);
                const moduleSpecifier = importDecl.getModuleSpecifierValue();
                // Attempt to reconstruct the import based on common patterns
                // This is a simplified example, will need to be expanded
                if (moduleSpecifier === '@/lib/core/middleware') {
                    // Assuming these are the expected imports
                    const expectedImports = ['NextRequest', 'NextResponse', 'withErrorHandling', 'validateQuery', 'checkPermission', 'createSuccessResponse'];
                    const currentNamedImports = importDecl.getNamedImports().map(ni => ni.getName());
                    const newNamedImports = Array.from(new Set([...currentNamedImports, ...expectedImports]));
                    // Remove the old import declaration and add a new one
                    importDecl.remove();
                    sourceFile.addImportDeclaration({
                        namedImports: newNamedImports,
                        moduleSpecifier: moduleSpecifier,
                    });
                    console.log(`Reconstructed import for ${moduleSpecifier}`);
                    foundAndFixed = true;
                    break;
                }
                else if (moduleSpecifier === 'next/server') {
                    const expectedImports = ['NextRequest', 'NextResponse'];
                    const currentNamedImports = importDecl.getNamedImports().map(ni => ni.getName());
                    const newNamedImports = Array.from(new Set([...currentNamedImports, ...expectedImports]));
                    importDecl.remove();
                    sourceFile.addImportDeclaration({
                        namedImports: newNamedImports,
                        moduleSpecifier: moduleSpecifier,
                    });
                    console.log(`Reconstructed import for ${moduleSpecifier}`);
                    foundAndFixed = true;
                    break;
                }
            }
        }
        if (!foundAndFixed) {
            console.warn(`Could not automatically fix missing name '${missingName}' in ${fault.filePath}`);
        }
    }
    // Add more fix strategies here for other error codes/messages
});
// Save all changes
project.saveSync();
console.log('All changes saved.');
// Output a success message or summary
console.log('Fixing script completed.');
