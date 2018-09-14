import { Validators } from './validators';
import { IsValidResponse } from './types';
import { ValidateFunction } from 'ajv';

export abstract class ValidObject {

    private _initialized: boolean = false;
    private _validator: ValidateFunction;

    constructor(data: object){
        Object.assign(this, data);
    }

    public isValid(): IsValidResponse {
        if (!this._initialized) {
            this.init();
        }
        return {
            valid: this._validator(this),
            errors: this._validator.errors
        }
    }

    private init(): void {
        this._validator = Validators.get(this.constructor.name);
        this._initialized = true;
    }
}