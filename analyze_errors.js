"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_morph_1 = require("ts-morph");
var fs = require("fs");
var path = require("path");
var project = new ts_morph_1.Project({
    tsConfigFilePath: path.resolve(__dirname, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
});
// Add source files that are likely to have errors based on the build log
var buildErrorsLogPath = path.resolve(__dirname, 'build_errors.initial.log');
var filePathsToAnalyze = [];
try {
    var logContent = fs.readFileSync(buildErrorsLogPath, 'utf8');
    var lines = logContent.split(String.fromCharCode(10)); // Use char code for newline to avoid escape issues
    var fileRegex = /^\.\/src\/app\/api\/(.+)$/; // Double escape backslashes for regex
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var match = line.match(fileRegex);
        if (match) {
            var relativePath = "src/app/api/".concat(match[1]);
            var fullPath = path.resolve(__dirname, relativePath);
            if (!filePathsToAnalyze.includes(fullPath)) {
                filePathsToAnalyze.push(fullPath);
            }
        }
    }
}
catch (error) {
    console.error("Error reading build_errors.initial.log: ".concat(error.message));
    process.exit(1);
}
if (filePathsToAnalyze.length === 0) {
    console.log('No files identified from build_errors.initial.log for analysis.');
    process.exit(0);
}
// Add only the files that were identified as having errors
filePathsToAnalyze.forEach(function (filePath) {
    if (fs.existsSync(filePath)) {
        project.addSourceFileAtPath(filePath);
    }
    else {
        console.warn("Warning: File not found at path: ".concat(filePath));
    }
});
var diagnostics = project.getPreEmitDiagnostics();
var structuredFaults = [];
diagnostics.forEach(function (diagnostic) {
    var sourceFile = diagnostic.getSourceFile();
    var filePath = sourceFile ? sourceFile.getFilePath() : 'unknown';
    var lineNumber;
    var columnNumber;
    if (diagnostic.getStart() !== undefined && sourceFile) {
        var lineAndChar = sourceFile.getLineAndColumnAtPos(diagnostic.getStart());
        lineNumber = lineAndChar.line + 1; // ts-morph lines are 0-indexed
        columnNumber = lineAndChar.column + 1; // ts-morph columns are 0-indexed
    }
    else {
        // Fallback removed, relying solely on getLineAndColumnAtPos
        lineNumber = undefined; // Indicate that line/column could not be determined
        columnNumber = undefined;
    }
    var message = diagnostic.getMessageText();
    var category = ts_morph_1.DiagnosticCategory[diagnostic.getCategory()];
    var code = diagnostic.getCode();
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
