import 'mocha';
import { expect } from 'chai';
import { TestObject } from './valid-object';

describe('Valid Object', function() {
    
    it('Is valid given all parameters and correct data types', function(){
        let data = {
            string: 'test',
            number: 456,
            object: {
                prop: "test"
            },
            boolean: true,
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(true);
        expect(result.errors).to.equal(null);
    })

    it('Is NOT valid given a missing required parameter', function(){
        let data = {
            number: 456,
            object: {
                prop: "test"
            },
            boolean: true,
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(false);
        expect(result.errors).to.not.equal(null);
    })

    it('Is NOT valid given incorrect string type', function(){
        let data = {
            string: 17,
            number: 456,
            object: {
                prop: "test"
            },
            boolean: true,
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(false);
        expect(result.errors).to.not.equal(null);
    })

    it('Is NOT valid given incorrect boolean type', function(){
        let data = {
            string: 'test',
            number: 456,
            object: {
                prop: "test"
            },
            boolean: 'true',
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(false);
        expect(result.errors).to.not.equal(null);
    })

    it('Is NOT valid given an incorrect object type', function(){
        let data = {
            string: 'test',
            number: 456,
            object: 'string',
            boolean: 'true',
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(false);
        expect(result.errors).to.not.equal(null);
    })

    it('Is NOT valid given an incorrect number type', function(){
        let data = {
            string: 'test',
            number: '17',
            object: {
                prop: "test"
            },
            boolean: 'true',
        };
        const result = new TestObject(data).isValid();
        expect(result.valid).to.equal(false);
        expect(result.errors).to.not.equal(null);
    })
})