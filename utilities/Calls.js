const { EmbedBuilder, Colors } = require("discord.js");



const logCommandUsage = async (client, user, request) => {
    if (!process.env.GUILDID || !process.env.LOGCHANNELID) return;
    try {
        const guild = await client.guilds.fetch(process.env.GUILDID);
        const channel = await guild.channels.fetch(process.env.LOGCHANNELID);
        var description = `**User:** ${user}\n**Request:** ${request}`;
        const embed = new EmbedBuilder()
            .setTitle(`New Request`)
            .setDescription(description)
            .setColor(Colors.Blurple)
            .setTimestamp();

        await channel.send({ embeds: [embed]});
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    logCommandUsage,
};