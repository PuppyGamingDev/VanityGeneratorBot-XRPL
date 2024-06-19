const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { checkUserRequests, removeRequestFromUser } = require('../../utilities/Storage');
const { updateRequests } = require('../../utilities/Generator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cancel")
        .setDescription("Cancel an open request")
        .addStringOption(option => option.setName('choice').setDescription('The request to be removed').setAutocomplete(true).setRequired(true))
        .setDMPermission(true),
    userInstall: true,
    async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices = ["None Selected"];
		var requests = checkUserRequests(interaction.user.id);
		if (requests && requests.length > 0) choices = requests;

		const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
	},
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const choice = interaction.options.getString('choice');
        if (choice === 'None Selected') {
            return await interaction.editReply({ content: `No choice was selected`});
        }
        removeRequestFromUser(interaction.user.id, choice);
        updateRequests();
        return await interaction.editReply({ content: `Your request has been cancelled`});
    },
};