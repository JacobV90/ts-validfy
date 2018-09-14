import * as Ajv from 'ajv';

type ObjectWithAny = {
    [prop: string]: any
}

export type Schema = {
    requestSchema: ObjectWithAny
    responseSchema: ObjectWithAny
}

export type SchemaDoc = {
    [ioName: string]: object;
}

export type IODefinitions = {
    name: string;
}

export type ValidatorMap = {
    [name: string]: Ajv.ValidateFunction;
}

export type IsValidResponse = {
    errors: Ajv.ErrorObject[] | undefined;
    valid: boolean | PromiseLike<any>;
}