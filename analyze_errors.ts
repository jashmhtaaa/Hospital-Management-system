
import { Project, DiagnosticCategory } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const projectRoot = '/root/Hospital-Management-System';

const project = new Project({
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'), // Absolute path to tsconfig.json
    skipAddingFilesFromTsConfig: true,

// Add source files that are likely to have errors based on the build log
const buildErrorsLogPath = path.resolve(projectRoot, 'build_errors.initial.log'); // Absolute path to log file
let filePathsToAnalyze: string[] = [];

try {
    const logContent = fs.readFileSync(buildErrorsLogPath, 'utf8');
    const lines = logContent.split(String.fromCharCode(10)); // Use char code for newline to avoid escape issues
    const fileRegex = /^\.\/src\/app\/api\/(.+)$/; // Double escape backslashes for regex
    for (const line of lines) {
        const match = line.match(fileRegex);
        if (match) {
            const relativePath = `src/app/api/${match[1]}`;
            const fullPath = path.resolve(projectRoot, relativePath); // Absolute path for source files
            if (!filePathsToAnalyze.includes(fullPath)) {
                filePathsToAnalyze.push(fullPath);
            }
        }
    }
} catch (error) { console.error(error); }`);
    process.exit(1);
}

if (filePathsToAnalyze.length === 0) {
    console.log('No files identified from build_errors.initial.log for analysis.');
    process.exit(0);
}

// Add only the files that were identified as having errors
filePathsToAnalyze.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        project.addSourceFileAtPath(filePath);
    } else {
        console.warn(`Warning: File not found at path: ${filePath}`);
    }
});

const diagnostics = project.getPreEmitDiagnostics();

const structuredFaults: any[] = [];

diagnostics.forEach(diagnostic => {
    const sourceFile = diagnostic.getSourceFile();
    const filePath = sourceFile ? sourceFile.getFilePath() : 'unknown';

    let lineNumber: number | undefined;
    let columnNumber: number | undefined;

    if (diagnostic.getStart() !== undefined && sourceFile) {
        const lineAndChar = sourceFile.getLineAndColumnAtPos(diagnostic.getStart());
        lineNumber = lineAndChar.line + 1; // ts-morph lines are 0-indexed
        columnNumber = lineAndChar.column + 1; // ts-morph columns are 0-indexed
    } else {
        lineNumber = undefined; // Indicate that line/column could not be determined
        columnNumber = undefined;
    }

    const message = diagnostic.getMessageText();
    const category = DiagnosticCategory[diagnostic.getCategory()];
    const code = diagnostic.getCode();

    structuredFaults.push({
        filePath: filePath,
        lineNumber: lineNumber,
        columnNumber: columnNumber,
        message: typeof message === 'string' ? message : message.getMessageText(),
        category: category,
        code: code,
        text: diagnostic.getStart() !== undefined && sourceFile ? sourceFile.getText().substring(diagnostic.getStart(),
});

console.log(JSON.stringify(structuredFaults, null, 2));
