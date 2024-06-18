// Initial requirements and variables
const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
require("dotenv/config");
const updateCommands = async () => {
    const generalcommands = [];
    const generalcommandsPath = path.join(__dirname, "commands/general");
    const generalcommandFiles = fs.readdirSync(generalcommandsPath).filter((file) => file.endsWith(".js"));
    // Creates a list of all General Slash Commands to register globally
    for (const file of generalcommandFiles) {
        const filePath = path.join(generalcommandsPath, file);
        const command = require(filePath);
        if (command.userInstall) {
            var commandJSON = command.data.toJSON();
            commandJSON["integration_types"] = [1];
            generalcommands.push(commandJSON);
        } else {
            generalcommands.push(command.data.toJSON());
        }
    }

    // const admincommands = [];
    // const admincommandsPath = path.join(__dirname, "commands/admin");
    // const admincommandFiles = fs.readdirSync(admincommandsPath).filter((file) => file.endsWith(".js"));
    // // Creates a list of all Admin Slash Commands to specific server
    // for (const file of admincommandFiles) {
    //     const filePath = path.join(admincommandsPath, file);
    //     const command = require(filePath);
    //     admincommands.push(command.data.toJSON());
    // }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // Submits the Slash Commands in the list to the Discord API to be registered to the server set in './config.json'
    rest.put(Routes.applicationCommands(process.env.CLIENTID), { body: generalcommands }).then((data) => console.log(`Successfully registered ${data.length} General commands.`));
    // rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: admincommands }).then((data) => console.log(`Successfully registered ${data.length} Admin commands.`));
};
module.exports = { updateCommands };
