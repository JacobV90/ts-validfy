/* tslint:disable:ter-prefer-arrow-callback*/
/* tslint:disable:no-increment-decrement*/
/* tslint:disable:max-line-length*/

import 'mocha';
import { ValidObject } from '../src/lib/valid-object';
import { Validators } from '../src/lib/validators';
import {
  validate,
  IsString,
  IsNumber,
  IsBoolean,
  IsDefined,
  ValidateNested,
} from 'class-validator';
import * as Joi from 'joi';

describe('Performance', function () {

  const maxNumOfValidations: number = 10000;
  const numInterations: number = 100;
  const step: number = Math.floor(maxNumOfValidations / numInterations);

  let voTime: number = 0;
  let joiTime: number = 0;
  let cvTime: number = 0;

  const data = {
    string: 'test',
    number: 456,
    object: {
      prop: 'test',
    },
    boolean: true,
  };

  // Valid Object usage
  class TestObject extends ValidObject {
    public string: string;
    public number: number;
    public object: object;
    public boolean: boolean;
    public optional?: string;

    constructor(data: any) {
      super(data);
    }
  }

  // Joi usage
  const schema = Joi.object().keys({
    string: Joi.string(),
    number: Joi.number(),
    object: Joi.object(),
    boolean: Joi.boolean(),
  });

  // Class validator usage
  class Schema {
    @IsString()
    @IsDefined()
    string: string;

    @IsNumber()
    @IsDefined()
    number: number;

    @IsDefined()
    @ValidateNested()
    object: object;

    @IsBoolean()
    @IsDefined()
    boolean: boolean;

    constructor(data: any) {
      Object.assign(this, data);
    }
  }

  after((done) => {
    const vOvsJoiPercentage = Math.floor((1 - (voTime / joiTime)) * 100);
    const vOVsCvPercentage = Math.floor((1 - (voTime / cvTime)) * 100);
    console.log(`${vOvsJoiPercentage}% (avg) faster than Joi`);
    console.log(`${vOVsCvPercentage}% (avg) faster than Class Validator`);
    done();
  });

  it('Valid Object', function (done) {
    for (let i = step; i  <= maxNumOfValidations; i += step) {
      const start = Date.now();
      for (let j = 0; j < i; ++j) {
        new TestObject(data).isValid();
      }
      const time = Date.now() - start;
      voTime += time;
    }
    done();
  });

  it('Joi', function (done) {
    for (let i = step; i  <= maxNumOfValidations; i += step) {
      const start = Date.now();
      for (let j = 0; j < i; ++j) {
        schema.validate(data);
      }
      const time = Date.now() - start;
      joiTime += time;
    }
    done();
  });

  it('Class Validator', function (done) {
    for (let i = step; i  <= maxNumOfValidations; i += step) {
      const start = Date.now();
      for (let j = 0; j < i; ++j) {
        const object = new Schema(data);
        validate(object);
      }
      const time = Date.now() - start;
      cvTime += time;
    }
    done();
  });
});
