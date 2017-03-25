import * as BPromise from 'bluebird';
import { config, Configuration } from './config';
import Bot from './bot';
const packageJson = require('../package');

export default function createServer(): void {
  console.log('Initializing bot...');
  const bot = new Bot();
  bot.connect();
}

