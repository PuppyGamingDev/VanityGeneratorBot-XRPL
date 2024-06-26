const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { addRequest } = require('../../utilities/Storage');
const { updateRequests } = require('../../utilities/Generator');
const uuid = require('uuid');
const { logCommandUsage } = require('../../utilities/Calls');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("request")
        .setDescription("Request a vanity address")
        .addStringOption(option => option.setName('string').setDescription('The value you want (5+ may take a long time)').setRequired(true))
        .setDMPermission(true),
    userInstall: true,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const requesting = interaction.options.getString('string');
        const id = uuid.v4();

        try {
            await interaction.user.send({ content: `Your request is being added to the queue ✅`})
        } catch (e) {
            console.log(e);
            return await interaction.editReply({ content: `Sorry but I couldn't seem to DM you, either open your DMs or open a DM with me first`});
        }

        await addRequest(id, interaction.user.id, requesting, 0, true);
        updateRequests();
        console.log(`>>REQUEST>> ${interaction.user.displayName} -requested- ${requesting}`);
        logCommandUsage(interaction.client, interaction.user.displayName, requesting)
        return await interaction.editReply({ content: `Your request has been added ✅`});
    },
};