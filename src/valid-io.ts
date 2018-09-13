import { Validators } from './validators';

export abstract class ValidObject {

    constructor(data: object){
        Object.assign(this, data);
    }

    public isValid() {
        return Validators.get(this.constructor.name)(this);
    }
}