/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import { ValidObject } from '../src/lib/valid-object';

describe('Valid Object', function () {

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

  it('Is valid given all parameters and correct data types', function () {
    const data = {
      string: 'test',
      number: 456,
      object: {
        prop: 'test',
      },
      boolean: true,
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(true);
    expect(result.errors).to.equal(null);
  });

  it('Is NOT valid given a missing required parameter', function () {
    const data = {
      number: 456,
      object: {
        prop: 'test',
      },
      boolean: true,
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(false);
    expect(result.errors).to.not.equal(null);
  });

  it('Is NOT valid given incorrect string type', function () {
    const data = {
      string: 17,
      number: 456,
      object: {
        prop: 'test',
      },
      boolean: true,
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(false);
    expect(result.errors).to.not.equal(null);
  });

  it('Is NOT valid given incorrect boolean type', function () {
    const data = {
      string: 'test',
      number: 456,
      object: {
        prop: 'test',
      },
      boolean: 'true',
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(false);
    expect(result.errors).to.not.equal(null);
  });

  it('Is NOT valid given an incorrect object type', function () {
    const data = {
      string: 'test',
      number: 456,
      object: 'string',
      boolean: 'true',
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(false);
    expect(result.errors).to.not.equal(null);
  });

  it('Is NOT valid given an incorrect number type', function () {
    const data = {
      string: 'test',
      number: '17',
      object: {
        prop: 'test',
      },
      boolean: 'true',
    };
    const result = new TestObject(data).isValid();
    expect(result.valid).to.equal(false);
    expect(result.errors).to.not.equal(null);
  });
});
