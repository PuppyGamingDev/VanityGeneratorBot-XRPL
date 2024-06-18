require("dotenv/config");
const wait = (t) => new Promise((s) => setTimeout(s, t, t));
const { EmbedBuilder, Colors } = require("discord.js");

// Requests value is { id: "uuid", user: "userDiscordID", requst: "requestedValue", finished: 0/1 }
let Requests = new Map();

const Database = require("../classes/Database");
let DB = null;
let Client = null;

const connectDB = async (c) => {
    Client = c;
    DB = new Database();
};

const addRequest = (id, userId, request, finished = 0, update = false) => {
    var newRequest = { id: id, user: userId, request: request, finished: 0 };
    Requests.set(id, newRequest);
    if (update) {
        DB.add("INSERT OR REPLACE INTO requests (id, userid, request, finished) VALUES (?, ?, ?, ?)", [id, userId, request, finished]);
    }
};

const removeRequest = (id) => {
    DB.add(`UPDATE requests SET finished = 1 WHERE id = "${id}"`, null);
    Requests.delete(id);
};

const getRequestsArray = async () => {
    // console.log('Requests:', Requests); // Log Requests to see its structure
    var allRequests = [];
    for (const [k, v] of Requests.entries()) {
        allRequests.push(v.request);
    }
    // console.log('All Requests:', allRequests); // Log the resulting array
    return allRequests;
};

const foundRequest = async (found, seed, address) => {
    for (const [k, v] of Requests.entries()) {
        if (v.request.toLowerCase() === found.toLowerCase()) {
            removeRequest(k);
            try {
                const user = await Client.users.fetch(v.user);
                const embed = new EmbedBuilder()
                    .setTitle(`Vanity Address Found!`)
                    .setColor(Colors.Green)
                    .setDescription(`**Phrase:** ${v.request}\n**Address: **${address}\n**Seed:** ${seed}\n\n*It is advised that you delete this message as soon as possible*`);
                await user.send({ embeds: [embed] });
            } catch (e) {
                console.log(e);
            }
            return;
        }
    }
    console.log(Requests)
};

module.exports = {
    connectDB,
    addRequest,
    removeRequest,
    getRequestsArray,
    foundRequest
};
