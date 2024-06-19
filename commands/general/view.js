const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { checkUserRequests } = require('../../utilities/Storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("view")
        .setDescription("View your open requests")
        .setDMPermission(true),
    userInstall: true,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const myRequests = checkUserRequests(interaction.user.id);

        const description = myRequests.join(',\n');

        const embed = new EmbedBuilder()
            .setTitle('Your Open Requests')
            .setColor(Colors.Blurple)
            .setDescription(myRequests.length > 0 ? description : `*No Open Requests*`)

        return await interaction.editReply({ embeds: [embed]});
    },
};