import * as BPromise from 'bluebird';
import { config } from './src/config';
import createServer from './src/server';

BPromise.config({
  warnings: config.NODE_ENV !== 'production',
  longStackTraces: true,
  cancellation: true,
});

createServer();

