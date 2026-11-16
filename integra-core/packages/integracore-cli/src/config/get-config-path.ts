import { homedir } from 'node:os';
import { join } from 'node:path';

export const getConfigPath = () => join(homedir(), '.integracore', 'config.json');
