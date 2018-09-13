export declare type Schema = {
    request: object;
    response: object;
};
export declare type SchemaDoc = {
    [apiName: string]: Schema;
};
export declare type IODefinitions = {
    name: string;
    parameterSchema: string;
    responseSchema: string;
};
