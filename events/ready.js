const { Events } = require('discord.js');
const { connectDB } = require('../utilities/Storage');
const { updateCommands } = require("../DeployCommands");

// Runs when bot logs in
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await connectDB(client);
        await updateCommands();
		console.log(`Vanity Gen Bot is ready!`);
	},
};