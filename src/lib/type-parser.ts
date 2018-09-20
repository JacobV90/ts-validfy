import * as fs from 'fs';
import * as ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import chalk from 'chalk';
import { Schemas } from './types';
import { config } from './config';
const tsconfig  = require('${process.cwd()}/tsconfig.json');
const glob = require('glob-fs')({ gitignore: true });

const errors: string[] = [];
const settings: TJS.PartialArgs = {
  required: true,
  ref: true,
  topRef: true,
};

const typeSymbols: string[] = [];
const schemas: Schemas = {};

export class TypeParser {

  public static parse() {
    console.log(chalk.cyan('Parsing ts source files...'));
    console.log('\r');

    const sourceFiles = glob.readdirSync(config.include);
    let generator: TJS.JsonSchemaGenerator;

    try {
      const program = TJS.getProgramFromFiles(sourceFiles, tsconfig.compilerOptions);
      generator = TJS.buildGenerator(program, settings);

      sourceFiles.forEach((filePath: string) => {
        console.log(chalk.whiteBright(filePath));
        const file = fs.readFileSync(filePath, 'utf-8');
        TypeParser.instrument(filePath, file);
      });
    } catch (error) {
      console.log(chalk.redBright(error));
      throw error;
    }

    typeSymbols.forEach((symbol: string) => {
      schemas[symbol] = generator.getSchemaForSymbol(symbol);
    });

    fs.writeFileSync('${config.outDir}/.schemas.json', JSON.stringify(schemas), 'utf-8');
    errors.forEach((error: string) => {
      console.log(chalk.redBright(error));
    });
    console.log('\r');
    console.log(chalk.bold.greenBright('Successfully generated object validation schemas'));
    console.log('\r');

  }
  private static visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      if (node.heritageClauses) {
        node.heritageClauses.forEach((heritageClause: ts.HeritageClause) => {
          if (heritageClause.token === 85 &&
             heritageClause.getText().indexOf('ValidObject') !== -1) {
            typeSymbols.push(node.name.escapedText.toString());
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
