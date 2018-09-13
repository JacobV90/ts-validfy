"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ts = require("typescript");
const path_1 = require("path");
const TJS = require("typescript-json-schema");
const chalk_1 = require("chalk");
const config_1 = require("./config");
let glob = require('glob-fs')({ gitignore: true });
const apiFiles = glob.readdirSync(config_1.config.include);
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
        console.log(chalk_1.default.cyan('Parsing Files...'));
        console.log('\r');
        const program = TJS.getProgramFromFiles([path_1.resolve(config_1.config.models)]);
        const generator = TJS.buildGenerator(program, settings);
        let counter = 0;
        apiFiles.forEach((filePath) => {
            console.log(chalk_1.default.whiteBright(filePath));
            let file = fs.readFileSync(filePath, 'utf-8');
            TypeParser.instrument(filePath, file);
        });
        ioDefs.forEach((io) => {
            // We can either get the schema for one file and one type...
            const req_schema = generator.getSchemaForSymbol(io.requestObjType);
            const res_schema = generator.getSchemaForSymbol(io.responseObjType);
            schemaDoc[io.name] = {
                request: req_schema,
                response: res_schema
            };
        });
        fs.writeFileSync(config_1.config.outDir + 'ioschemas.json', JSON.stringify(schemaDoc), 'utf-8');
        errors.forEach((error) => {
            console.log(chalk_1.default.redBright(error));
        });
        console.log('\r');
        console.log(chalk_1.default.bold.greenBright('Finished generating API json schemas'));
        console.log('\r');
    }
    static visit(node) {
        if (ts.isClassDeclaration(node)) {
            if (node.heritageClauses) {
                node.heritageClauses.forEach((heritageClause) => {
                    if (heritageClause.token === 85 && heritageClause.getText().includes('RestApiEndpoint')) {
                        let io = {
                            name: node.name.escapedText
                        };
                        heritageClause.types.forEach((params) => {
                            let i = 0;
                            if (params.typeArguments) {
                                params.typeArguments.forEach((type) => {
                                    i == 0 ?
                                        io.parameterSchema = type.getText() :
                                        io.responseSchema = type.getText();
                                    i++;
                                });
                                ioDefs.push(io);
                            }
                            else {
                                errors.push('RestApiEndpoint has no types for sub class: ' + io.name);
                            }
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
