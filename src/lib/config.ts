import { Config } from './types';

function getConfig(): Config {
  try {
    return require(`${process.cwd()}/validation.json`);
  } catch (error) {
    let config;
    try {
      return config = require(`${process.cwd()}/package.json`).validation;
    } catch (error) {
      throw error;
    }
    if (!config) {
      throw new Error('missing object validation config info');
    }
  }
}

export const config = getConfig();
