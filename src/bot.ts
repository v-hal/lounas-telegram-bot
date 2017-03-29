import { config, Configuration } from './config';
import LunchClient from './lunch-client';
import * as R from 'rambda';
import Views from './views';
const lunchClient = new LunchClient('http://www.lounasaika.net/api/v1/menus.json');
const TeleBot = require('telebot');


class SpeechBot {
  public teleBot;

  constructor() {
    this.teleBot = new TeleBot({
      token: config.TELEGRAM_BOT_TOKEN,
      port: config.PORT,
    });
    this.initialize();
    return this;
  }

  connect() {
    return this.teleBot.connect();
  }

  initialize() {
    this.teleBot.on('*', msg => {
        console.log('Received a message: ' + JSON.stringify(msg));
    });

    this.teleBot.on('callbackQuery', msg => {
      console.log('Received a message: ' + JSON.stringify(msg));

      if (msg.data.startsWith(BotCommand.campus)) {
        const campus = R.tail(msg.data.split(' ')).join(' ');
        return lunchClient.getRestaurantsByCampus(campus).then(restaurants => {
          const keyboard = this.createInlineKeyboard(restaurants, r => r, r => `${BotCommand.restaurant} ${r}`);
          return this.teleBot.sendMessage(msg.from.id, 'Valitse ravintola', keyboard);
        });
      } else if (msg.data.startsWith(BotCommand.restaurant)) {
        const restaurant = R.tail(msg.data.split(' ')).join(' ');
        return lunchClient.getMenuByRestaurant(restaurant).then(menu => {
          return Views.render('restaurant', menu).then(replyMsg =>
            this.teleBot.sendMessage(msg.from.id, replyMsg)
          );
        });
      }
    });

    this.teleBot.on('/start', msg => {
      let firstName = msg.from.first_name;
      return lunchClient.getCampuses().then(menus => {
        const keyboard = this.createInlineKeyboard(menus, m => m, m => `${BotCommand.campus} ${m}`);
        return this.teleBot.sendMessage(msg.from.id, 'Valitse kampus', keyboard);
      });
    });
  }

  arrayToTwoDimensionalArray<T>(array: Array<T>, rowSize: number): Array<Array<T>> {
    const rows = Math.ceil(array.length / rowSize);
    const ranges = Array.from(Array(rows).keys())
      .map(r => r * rowSize)
      .map(r => [r, r + rowSize - 1]);
    return ranges.map(range => array.slice(range[0], range[1]));
  }

  createInlineKeyboard<T>(items: Array<T>, labelFn: (item: T) => string, commandFn: (item: T) => string, rowSize: number = 4): any {
    const buttons = items
      .map(item => this.teleBot.inlineButton(labelFn(item), { callback: commandFn(item)}));
    const buttonRows = this.arrayToTwoDimensionalArray(buttons, rowSize);
    return  { markup: this.teleBot.inlineKeyboard(buttonRows)};
  }
}

type BotCommandOption = '/campus' | '/restaurant';

class BotCommand extends String {
  public static campus: BotCommandOption = '/campus';
  public static restaurant: BotCommandOption = '/restaurant';
}

export default SpeechBot;
