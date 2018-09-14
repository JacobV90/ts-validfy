"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.config = JSON.parse(fs.readFileSync('./ioconfig.json', 'utf-8'));
