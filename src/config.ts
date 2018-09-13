import * as fs from 'fs';
export const config = JSON.parse(fs.readFileSync('./ioconfig.json', 'utf-8'));
