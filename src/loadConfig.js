import { parse } from 'yaml';
import rawConfig from './config.yml?raw';

export const config = parse(rawConfig);