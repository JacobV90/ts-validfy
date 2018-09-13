import { Validators } from './validators';

export abstract class ValidObject {

    constructor(data: object){
        Object.assign(this, data);
    }

    public isValid() {
        let validator = Validators.get(this.constructor.name);
        const isValid = validator(this);

        return {valid: isValid, errors: validator.errors}
    }
}