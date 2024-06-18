const { Events, EmbedBuilder, Colors } = require('discord.js');
const { logCommandUsage } = require('../utilities/Calls');

// Handles Slash Command Interactions
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			try {
				await command.execute(interaction);
				await logCommandUsage(interaction, "interactionCreate");
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
			}
		}
		else if (interaction.isButton()) {
			try {
				const button = require(`./buttons/${interaction.customId}.js`);
				await button.execute(interaction);
			} catch (error) {
				console.log(error);
				await interaction.reply({ content: "There was an error while executing this button", ephemeral: true })
			}
		}
	},
};