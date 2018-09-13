import * as fs from 'fs';
import * as ts from 'typescript';
import {resolve} from "path";
import * as TJS from "typescript-json-schema";
import chalk from 'chalk';
import { IODefinitions, SchemaDoc} from './types';
import { config } from './config';
const tsconfig  = require('../tsconfig.json');

let glob = require('glob-fs')({ gitignore: true });
const sourceFiles = glob.readdirSync(config.include);
const errors: string[] = [];
const settings: TJS.PartialArgs = {
  required: true,
  ref: true,
  topRef: true
};

let ioDefs: IODefinitions[] = [];
let schemaDoc: SchemaDoc = {};
  
export class TypeParser {

  public static parse() {
    console.log(chalk.cyan('Parsing ts source files...'));
    console.log('\r');

    let generator: TJS.JsonSchemaGenerator;

    try {
      const program = TJS.getProgramFromFiles(sourceFiles, tsconfig.compilerOptions);
      generator = TJS.buildGenerator(program, settings);

      sourceFiles.forEach((filePath: string) => {
        console.log(chalk.whiteBright(filePath))
        let file = fs.readFileSync(filePath, 'utf-8');
        TypeParser.instrument(filePath, file);
      });
    } catch (error) {
      console.log(chalk.redBright(error));
      throw error;
    }
  
    ioDefs.forEach((io:any) => {
      schemaDoc[io.name] = generator.getSchemaForSymbol(io.name);
    });
  
    fs.writeFileSync(config.outDir + 'ioschemas.json', JSON.stringify(schemaDoc), 'utf-8');
    errors.forEach((error: string) => {
      console.log(chalk.redBright(error));
    })
    console.log('\r');
    console.log(chalk.bold.greenBright('Finished generating IO validation schemas'));
    console.log('\r');

  }
  private static visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      if(node.heritageClauses) {
        node.heritageClauses.forEach((heritageClause: ts.HeritageClause) => {
          if (heritageClause.token === 85 && heritageClause.getText().includes('ValidObject')) {
            ioDefs.push({
              name: node.name.escapedText.toString()
            })
          }
        });
      }
    }
    node.forEachChild(TypeParser.visit);
  }
  
  private static instrument(fileName: string, sourceCode: string) {
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
    TypeParser.visit(sourceFile);
  }
}
