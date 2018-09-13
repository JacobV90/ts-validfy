import 'mocha';
import { expect } from 'chai';
import { TestObject } from './valid-object';
import { TypeParser } from '../src/type-parser';
import { Validators } from '../src/validators';

describe('ValidIO', function() {


    before(() => {
        TypeParser.parse();
        const test = new TestObject({prop: 'test', keyword: 'test'});
        Validators.initialize();
        console.log(test.isValid());
    })

    it('successfully run provided valid parameters and response', function(){
        const data = {
            email: "random-email",
            name: 'Test User',
            password: "clever-password"
        }
    })

    it('request error thrown provided invalid parameters', function(){
        
    })

    it('response error thrown provided an invalid response', function(){
        
    })
})