
import * as fs from 'fs';
import * as BPromise from 'bluebird';
import * as R from 'ramda';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import Cache from './cache';

const cache = new Cache(120 * 1000); // 2 minutes
const viewsDir = path.join(__dirname, '../views');

class Views {
  static render(viewName: string, model: any): PromiseLike<string> {
    return this.getView(viewName).then(view => Handlebars.compile(view)(model));
  }

  static getView(viewName: string): BPromise<string> {
    return this.getViews()
      .then(views => views[viewName]);
  }

  static getViews(): BPromise<any> {
    return cache.get(Views.readView, viewsDir);
  }

  static readView(viewDirectory: string) {
    const readDir = BPromise.promisify(fs.readdir);
    const readFile: (path: string, encoding: string) =>
      string = <(...all: any[]) => any>BPromise.promisify(fs.readFile);
    const fileNamesPromise = readDir(viewsDir);
    const filesPromise = fileNamesPromise.then(files =>
      BPromise.map(files, file =>
        readFile(path.join(viewDirectory, file), 'utf-8'))
    );
    return BPromise.join(fileNamesPromise, filesPromise)
      .then(([names, files]) =>
        R.zipObj(names.map(f => R.dropLast(1, f.split('.')).join('.')), files));
  }
}

export default Views;
