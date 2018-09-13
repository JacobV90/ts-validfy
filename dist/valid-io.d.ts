import * as Ajv from 'ajv';
export declare abstract class ValidIO<In, Out> {
    private static _fileName;
    protected validateParameters: Ajv.ValidateFunction;
    protected validateResponse: Ajv.ValidateFunction;
    private _schemaDoc;
    constructor(ioName: string);
    private shema;
}
