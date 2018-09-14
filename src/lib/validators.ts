import * as Ajv from 'ajv';
import { resolve } from 'path';
import { config } from './config';
import { ValidatorMap, Schemas } from './types';

export class Validators {

  private static fileName: string = '.schemas.json';
  private static validators: ValidatorMap = {};
  private static schemasCompiled: boolean = false;
  private static schemasLoaded: boolean = false;
  private static schemas: Schemas = {};
  private static compiler: Ajv.Ajv;

  public static get(name: string): Ajv.ValidateFunction {
    if (!Validators.schemasLoaded) {
      Validators.loadSchemas();
      Validators.compileSchema(name);
    } else if (!Validators.validators[name]) {
      Validators.compileSchema(name);
    }
    return Validators.validators[name];
  }

  public static init(): void {
    if (!Validators.schemasLoaded) {
      Validators.loadSchemas();
    }
    if (!Validators.schemasCompiled) {
      Validators.compileSchemas();
    }
  }

  private static compileSchema(name: string) {
    const validator = Validators.compiler.compile(Validators.schemas[name]);
    Validators.validators[name] = validator;
  }

  private static compileSchemas() {
    for (const key of Object.keys(Validators.schemas)) {
      Validators.compileSchema(key);
    }
    Validators.schemasCompiled = true;
  }

  private static loadSchemas() {
    Validators.schemas = require(resolve(config.outDir, Validators.fileName));
    Validators.compiler = new Ajv();
    Validators.schemasLoaded = true;
  }
}
