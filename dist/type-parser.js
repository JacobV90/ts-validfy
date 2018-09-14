"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ts = require("typescript");
const TJS = require("typescript-json-schema");
const chalk_1 = require("chalk");
const config_1 = require("./config");
const tsconfig = require('../tsconfig.json');
let glob = require('glob-fs')({ gitignore: true });
const sourceFiles = glob.readdirSync(config_1.config.include);
const errors = [];
const settings = {
    required: true,
    ref: true,
    topRef: true
};
let ioDefs = [];
let schemaDoc = {};
class TypeParser {
    static parse() {
        console.log(chalk_1.default.cyan('Parsing ts source files...'));
        console.log('\r');
        let generator;
        try {
            const program = TJS.getProgramFromFiles(sourceFiles, tsconfig.compilerOptions);
            generator = TJS.buildGenerator(program, settings);
            sourceFiles.forEach((filePath) => {
                console.log(chalk_1.default.whiteBright(filePath));
                let file = fs.readFileSync(filePath, 'utf-8');
                TypeParser.instrument(filePath, file);
            });
        }
        catch (error) {
            console.log(chalk_1.default.redBright(error));
            throw error;
        }
        ioDefs.forEach((io) => {
            schemaDoc[io.name] = generator.getSchemaForSymbol(io.name);
        });
        fs.writeFileSync(config_1.config.outDir + 'ioschemas.json', JSON.stringify(schemaDoc), 'utf-8');
        errors.forEach((error) => {
            console.log(chalk_1.default.redBright(error));
        });
        console.log('\r');
        console.log(chalk_1.default.bold.greenBright('Finished generating IO validation schemas'));
        console.log('\r');
    }
    static visit(node) {
        if (ts.isClassDeclaration(node)) {
            if (node.heritageClauses) {
                node.heritageClauses.forEach((heritageClause) => {
                    if (heritageClause.token === 85 && heritageClause.getText().includes('ValidObject')) {
                        ioDefs.push({
                            name: node.name.escapedText.toString()
                        });
                    }
                });
            }
        }
        node.forEachChild(TypeParser.visit);
    }
    static instrument(fileName, sourceCode) {
        const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
        TypeParser.visit(sourceFile);
    }
}
exports.TypeParser = TypeParser;
