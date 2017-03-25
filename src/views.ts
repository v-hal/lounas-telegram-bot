import * as cache from 'memory-cache';
import * as fs from 'fs';
import * as BPromise from 'bluebird';
import * as R from 'ramda';
import * as Handlebars from 'handlebars';
import * as path from 'path';
const cacheKey = 'views.all';
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
    const readDir = BPromise.promisify(fs.readdir);
    const readFile: (path: string, encoding: string) =>
      string = <(...all: any[]) => any>BPromise.promisify(fs.readFile);
    const cachedViews: string = cache.get(cacheKey);
    if (cachedViews) {
      return BPromise.resolve(cachedViews);
    }

    const fileNamesPromise = readDir(viewsDir);
    const filesPromise = fileNamesPromise.then(files =>
      BPromise.map(files, file =>
        readFile(path.join(viewsDir, file), 'utf-8'))
    );

    return BPromise.join(fileNamesPromise, filesPromise)
      .then(([names, files]) =>
        R.zipObj(names.map(f => R.dropLast(1, f.split('.')).join('.')), files));
  }
}

export default Views;
