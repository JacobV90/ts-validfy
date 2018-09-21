import * as Ajv from 'ajv';
import { ValidatorMap, Schemas } from './types';
import { FileSystem } from './file-system';

export class Validators {

  private static validators: ValidatorMap = {};
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

  private static compileSchema(name: string) {
    if (Validators.schemas[name]) {
      const validator = Validators.compiler.compile(Validators.schemas[name]);
      Validators.validators[name] = validator;
    } else {
      throw new Error(`${name} does not have a generated json schema`);
    }
  }

  private static loadSchemas() {
    Validators.schemas = FileSystem.getSchemas();
    Validators.compiler = new Ajv();
    Validators.schemasLoaded = true;
  }
}
