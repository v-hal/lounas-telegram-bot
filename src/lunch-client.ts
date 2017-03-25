import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as R from 'ramda';

class LunchClient {
  public url: string;

  constructor(url) {
    this.url = url;
    return this;
  }

  getMenus(): Promise<Array<any>> {
    return axios.get(this.url)
      .then(resp => resp.data) as Promise<Array<any>>;
  }

  getCampuses(): Promise<Array<string>> {
    return this.getMenus().then(menus =>
      R.uniq(menus.map(m => m.campus))
    );
  }

  getRestaurantsByCampus(campus: string): Promise<Array<string>> {
    return this.getMenus().then(menus =>
      R.filter(r => r.campus === campus, menus)
        .map(menu => menu.name)
    );
  }

  getMenusByCampus(campus: string): Promise<Array<any>> {
    return this.getMenus().then(menus => R.filter(m => m.campus === campus, menus));
  }

  getMenuByRestaurant(restaurant: string): Promise<any> {
    return this.getMenus().then(menus => R.head(R.filter(m => m.name === restaurant, menus)));
  }

}

export default LunchClient;