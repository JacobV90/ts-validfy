import * as Ajv from 'ajv';
import { resolve } from 'path';
import { config } from './config';
import { ValidatorMap, Schemas } from './types';

export class Validators {

    private static _fileName: string = '.schemas.json';
    private static _validators: ValidatorMap = {};
    private static _schemasCompiled: boolean = false;
    private static _schemasLoaded: boolean = false;
    private static _schemas: Schemas = {};
    private static _compiler: Ajv.Ajv;

    public static get(name: string): Ajv.ValidateFunction {
        if (!Validators._schemasLoaded) {
            Validators.loadSchemas();
            Validators.compileSchema(name);
        }
        else if (!Validators._validators[name]) {
            Validators.compileSchema(name);
        }
        return Validators._validators[name];
    }

    public static init(): void {
        if (!Validators._schemasLoaded) {
            Validators.loadSchemas();
        }
        if (!Validators._schemasCompiled) {
            Validators.compileSchemas();
        }
    }

    private static compileSchema(name: string) {
        let validator = Validators._compiler.compile(Validators._schemas[name]);
        Validators._validators[name] = validator;
    }

    private static compileSchemas() {
        for( const key of Object.keys(Validators._schemas)) {
            Validators.compileSchema(key);
        }
        Validators._schemasCompiled = true;
    }

    private static loadSchemas() {
        Validators._schemas = require(resolve(config.outDir, './' + Validators._fileName))            
        Validators._compiler = new Ajv();
        Validators._schemasLoaded = true;
    }
}