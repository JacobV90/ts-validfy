import { ValidObject } from '../src/lib/valid-object';

export class TestObject extends ValidObject {
    public string: string;
    public number: number;
    public object: object;
    public boolean: boolean;
    public optional?: string;

    constructor(data: any) {
        super(data);
    }
}