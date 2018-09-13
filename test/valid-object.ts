import { ValidObject } from '../src/valid-io';

export class TestObject extends ValidObject {
    public prop: string;
    public keyword: string;

    constructor(data: any) {
        super(data);
    }
}