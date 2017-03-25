interface Configuration {
  NAME: string;
  PORT: number;
  NODE_ENV: string;
  TELEGRAM_BOT_TOKEN: string;
}

const config: Configuration = {
  NAME: 'Telegram bot for checking student restaurant menus.',
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};

export { config, Configuration };