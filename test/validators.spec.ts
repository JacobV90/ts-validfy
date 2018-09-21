/* tslint:disable:ter-prefer-arrow-callback*/

import { Validators } from '../src/lib/validators';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Validators', function () {

  const validObjectName: string = 'TestObject';

  it('get validator for registered valid object', function () {
    const validator = Validators.get(validObjectName);
    expect(validator).to.not.be.undefined;
  });

  it('does NOT get a validator for a non-registered valid object', function () {
    let validator;
    try {
      validator = Validators.get('NotRegistered');
    } catch (error) {
      expect(validator).to.be.undefined;
      expect(error.message).to.equal('NotRegistered does not have a generated json schema');
    }
  });

  it('no error occurs when init is called again', function () {
    const validator = Validators.get(validObjectName);
    expect(validator).to.not.be.undefined;
  });
});
