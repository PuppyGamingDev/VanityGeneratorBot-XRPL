# VanityGeneratorBot-XRPL
Discord bot for users to generate Vanity Wallet Addresses for XRP Ledger.

This bot was an adaptation of the useful script by WietseWind for generating Vanity Addresses [FOUND HERE](https://github.com/WietseWind/xrp-vanity-generator)

## Your Env file
Rename the current `.env.example` to just `.env` and fill in the values.

```js
TOKEN= // Discord Bot Token
CLIENTID= // Discord Bot Client ID
GUILDID= // Discord Bot Management Guild ID
LOGCHANNELID= // Channel ID to receive usage logs if wanted
DBPATH= // Local path to the .db file for SQLite
```

- `TOKEN` & `CLIENTID` are for your Discord Application and can be obtained using [THIS GUIDE](https://puppy-tools.gitbook.io/setup-guides/discord-bot/app-creation)
- `GUILDID` is for if you want to be able to log usage, enter your Discord Server's ID here (Will need to invite the bot to your server)
- `LOGCHANNELID` is the channel in your server that you wish to receive the logs in
- `DBPATH` is the relative path to where you want to have the generated `database.db` file stored which holds all requests (requires a trailing '/' also)

Save it!

## User Installs
This bot is made to utilize Discord's new 'User Installs' method instead of 'Guild Installs'. This means that users can use the commands anywhere in any server that they can use a Slash Command without the server needing to invite the bot. From the Discord Developer Dashboard on your Application's page, naviagte to the `Installation` tab and check the box for `User Install` and then in the `Install Link` area, in the dropdown box, select `Discord Provided Link`. You can then visit this URL to install the bot to your User.

## Guild Install
For inviting the bot to your server for logs, you can invite the bot normally, here's a handy [GUIDE](https://puppy-tools.gitbook.io/setup-guides/discord-bot/inviting-your-bot)

## Run It!
You can start the bot using the command `node Bot.js`. It will display in the console that it is running once it has imported any unfinshed requests from the database (if there are any).

## Usage
You can easily request a vanity address using the `/request` command. It will add your request into the list of terms it is searching for and begin looking (if not already). Once the queue is empty, the bot takes a break from generating addresses as there is no need. It doesn't save any information about addresses and seeds locally, once it send the result to a user, it moves onto the next.

## Finishing up
If you have any questions, my DMs are always open on

- Twitter > @iamshiffed
- Discord > shiffed
- Email > shiffed@puppy.tools

Tips are always welcome and help continue development

XRPL: `rm2AEVUcxeYh6ZJUTkWUqVRPurWdn4E9W`