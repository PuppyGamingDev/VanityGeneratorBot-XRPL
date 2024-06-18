const keypairs = require("ripple-keypairs");
const { getRequestsArray, foundRequest } = require("./Storage");

let running = false;
let allRequests = [];

const updateRequests = async () => {
    allRequests = await getRequestsArray();
    if (!running && allRequests.length > 0) {
        RunRequests();
    }
};

const RunRequests = async () => {
    running = true;
    var attempts = 1
    while (attempts < 1000) {
        var re = "^(r)(" + allRequests.join("|") + ")(.+)$";
        const regexp = new RegExp(re, "i");
        const seed = keypairs.generateSeed();
        const keypair = keypairs.deriveKeypair(seed);
        const address = keypairs.deriveAddress(keypair.publicKey);
        const account = {
            address: address,
            secret: seed,
        };
        const test = regexp.exec(account.address);
        if(test) {
            console.log(test);
            await foundRequest(test[2], seed, address);
            allRequests = await getRequestsArray();
            if (allRequests.length < 1) attempts = 1000;
        }
        attempts++;
    }
    running = false;
    updateRequests();
};

module.exports = {
    updateRequests,
};
