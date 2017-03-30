import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as R from 'ramda';
import Cache from './cache';
import * as BPromise from 'bluebird';

class LunchClient {
  private url: string;
  private cache: Cache;

  constructor(url) {
    this.url = url;
    this.cache = new Cache(120 * 1000); // 2 minutes
    return this;
  }

  getMenus(): BPromise<Array<any>> {
    return this.cache.get(axios.get, this.url)
      .then(resp => resp.data as Array<any>);
  }

  getCampuses(): BPromise<Array<string>> {
    return this.getMenus().then(menus =>
      R.uniq(menus.map(m => m.campus))
    );
  }

  getRestaurantsByCampus(campus: string): BPromise<Array<string>> {
    return this.getMenus().then(menus =>
      R.filter(r => r.campus === campus, menus)
        .map(menu => menu.name)
    );
  }

  getMenusByCampus(campus: string): BPromise<Array<any>> {
    return this.getMenus().then(menus => R.filter(m => m.campus === campus, menus));
  }

  getMenuByRestaurant(restaurant: string): BPromise<any> {
    return this.getMenus().then(menus => R.head(R.filter(m => m.name === restaurant, menus)));
  }

}

export default LunchClient;