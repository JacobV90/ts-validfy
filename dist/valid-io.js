"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const Ajv = require("ajv");
const path_1 = require("path");
class ValidIO {
    constructor(ioName) {
        const validator = new Ajv();
        this._schemaDoc = this.shema();
        this.validateParameters = validator.compile(this._schemaDoc[ioName].request);
        this.validateResponse = validator.compile(this._schemaDoc[ioName].response);
    }
    shema() {
        return require(path_1.resolve(config_1.config.outDir, './' + ValidIO._fileName));
    }
}
ValidIO._fileName = 'ioschemas.json';
exports.ValidIO = ValidIO;
