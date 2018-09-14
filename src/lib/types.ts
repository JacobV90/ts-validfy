import * as Ajv from 'ajv';

export type Config = {
  include: string;
  outDir: string;
};

export type Schemas = {
  [name: string]: object;
};

export type ValidatorMap = {
  [name: string]: Ajv.ValidateFunction;
};

export type IsValidResponse = {
  errors: Ajv.ErrorObject[] | undefined;
  valid: boolean | PromiseLike<any>;
};
