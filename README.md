# Lounas telegram bot
A telegram bot for checking menus of student restaurants in the capita region of Helsinki, Finland.

The bot uses [lounasaika.net](http://lounasaika.net/) JSON API ([GitHub](https://github.com/paav-o/lounasaika)).

⚠️ The lounasaika.net API no longer exists and that's why the bot doesn't work anymore.

## Getting running
1. Clone the repository
2. Create yourself an `.env` file based on the `.env.sample` file example
3. Set up the environment variables in the file and run `source .env`
2. Run `npm install`
3. Run `npm start watch`

# Environment variables

Name                               | Description
-----------------------------------|-------------------------------------
`TELEGRAM_BOT_TOKEN`               | Token for [telegram bot](https://core.telegram.org/bots)
