import * as cache from 'memory-cache';
import * as BPromise from 'bluebird';
import * as R from 'ramda';
class Cache {
  private  ttlMilliseconds: number = 0;

  constructor(ttlMilliseconds: number) {
    this.ttlMilliseconds = ttlMilliseconds;
  }

  get<T>(func: (...args: any[]) => T, ...functionArguments): BPromise<any> {
    const key = `${func.name}(${JSON.stringify(functionArguments)})`;
    const cachedResult = cache.get(key);
    if (cachedResult === null || cachedResult === undefined) {
      return BPromise.resolve(func(...functionArguments))
        .then(result =>  {
          cache.put(key, result, this.ttlMilliseconds);
          return result;
        });
    }
    return BPromise.resolve(cachedResult);
  }
}

export default Cache;