import * as Ajv from 'ajv';
import { resolve } from 'path';
import { config } from './config';

import { ValidatorMap, SchemaDoc } from './types';

export class Validators {

    private static _fileName: string = 'ioschemas.json';
    private static _validators: ValidatorMap = {};
    private static _initialized: boolean = false;
    private static _schemas: SchemaDoc = {};

    public static get(name: string): Ajv.ValidateFunction {
        return Validators._validators[name]
    }

    public static initialize(): void {
        if (!Validators._initialized) {
            Validators._schemas = require(resolve(config.outDir, './' + Validators._fileName))
            const compiler = new Ajv();
            for( const key of Object.keys(Validators._schemas)) {
                Validators._validators[key] = compiler.compile(Validators._schemas[key]);
            }
        }
    }
}