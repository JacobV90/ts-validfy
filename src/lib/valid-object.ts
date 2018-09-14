import { Validators } from './validators';
import { IsValidResponse } from './types';

export abstract class ValidObject {

  constructor(data: object) {
    Object.assign(this, data);
  }

  public isValid(): IsValidResponse {
    const validator = Validators.get(this.constructor.name);
    return {
      valid: validator(this),
      errors: validator.errors,
    };
  }
}
