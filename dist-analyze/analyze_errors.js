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
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'), // Absolute path to tsconfig.json
    skipAddingFilesFromTsConfig: true,
});
// Add source files that are likely to have errors based on the build log
const buildErrorsLogPath = path.resolve(projectRoot, 'build_errors.initial.log'); // Absolute path to log file
let filePathsToAnalyze = [];
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
}
catch (error) {
    console.error(`Error reading build_errors.initial.log: ${error.message}`);
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
    }
    else {
        console.warn(`Warning: File not found at path: ${filePath}`);
    }
});
const diagnostics = project.getPreEmitDiagnostics();
const structuredFaults = [];
diagnostics.forEach(diagnostic => {
    const sourceFile = diagnostic.getSourceFile();
    const filePath = sourceFile ? sourceFile.getFilePath() : 'unknown';
    let lineNumber;
    let columnNumber;
    if (diagnostic.getStart() !== undefined && sourceFile) {
        const lineAndChar = sourceFile.getLineAndColumnAtPos(diagnostic.getStart());
        lineNumber = lineAndChar.line + 1; // ts-morph lines are 0-indexed
        columnNumber = lineAndChar.column + 1; // ts-morph columns are 0-indexed
    }
    else {
        lineNumber = undefined; // Indicate that line/column could not be determined
        columnNumber = undefined;
    }
    const message = diagnostic.getMessageText();
    const category = ts_morph_1.DiagnosticCategory[diagnostic.getCategory()];
    const code = diagnostic.getCode();
    structuredFaults.push({
        filePath: filePath,
        lineNumber: lineNumber,
        columnNumber: columnNumber,
        message: typeof message === 'string' ? message : message.getMessageText(),
        category: category,
        code: code,
        text: diagnostic.getStart() !== undefined && sourceFile ? sourceFile.getText().substring(diagnostic.getStart(), diagnostic.getStart() + diagnostic.getLength()) : ''
    });
});
console.log(JSON.stringify(structuredFaults, null, 2));
