import { resolve } from 'path';
import { config } from './config';
import * as fs from 'fs';

export class FileSystem {
  private static readonly fileName: string = '.schemas.json';

  public static getSchemas() {
    try {
      return JSON.parse(fs.readFileSync(resolve(config.outDir, FileSystem.fileName), 'utf8'));
    } catch (error) {
      throw error;
    }
  }
}
