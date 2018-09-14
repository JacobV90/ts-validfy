import * as Ajv from 'ajv';
declare type ObjectWithAny = {
    [prop: string]: any;
};
export declare type Schema = {
    requestSchema: ObjectWithAny;
    responseSchema: ObjectWithAny;
};
export declare type SchemaDoc = {
    [ioName: string]: object;
};
export declare type IODefinitions = {
    name: string;
};
export declare type ValidatorMap = {
    [name: string]: Ajv.ValidateFunction;
};
export declare type IsValidResponse = {
    errors: Ajv.ErrorObject[] | undefined;
    valid: boolean | PromiseLike<any>;
};
export {};
