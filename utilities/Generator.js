const keypairs = require("ripple-keypairs");
const { getRequestsArray, foundRequest, updateStatus } = require("./Storage");

let running = false;
let allRequests = [];

const updateRequests = async () => {
    allRequests = await getRequestsArray();
    if (!running && allRequests.length > 0) {
        RunRequests();
    }
};

const RunRequests = async () => {
    updateStatus();
    console.log('Checkign for matches');
    running = true;
    let attempts = 1;

    // Function to check and refresh allRequests if empty
    const refreshRequestsIfEmpty = async () => {
        if (allRequests.length === 0) {
            allRequests = await getRequestsArray();
        }
    };

    const processRequests = async () => {
        while (attempts < 1000) {
            await refreshRequestsIfEmpty();
            if (allRequests.length === 0) {
                break; // Exit the loop if no requests are available after refresh
            }

            const re = `^(r)(${allRequests.join('|')})(.+)$`;
            const regexp = new RegExp(re, 'i');
            const seed = keypairs.generateSeed();
            const keypair = keypairs.deriveKeypair(seed, { algorithm: 'ecdsa-secp256k1'});
            const address = keypairs.deriveAddress(keypair.publicKey);
            const account = {
                address: address,
                secret: seed,
            };

            const test = regexp.exec(account.address);
            if (test) {
                await foundRequest(test[2], seed, address);
                allRequests = await getRequestsArray(); // Refresh the requests array after processing
                if (allRequests.length === 0) {
                    break; // Exit the loop if no requests are available after processing
                }
            }

            attempts++;
            if (attempts === 1000) {
                allRequests = await getRequestsArray();
                attempts = 1; // Reset attempts and ensure we check for new requests again
            }
            updateStatus();

            // Yield control to the event loop
            await new Promise(resolve => setImmediate(resolve));
        }

        running = false;
    };

    processRequests();
};

module.exports = {
    updateRequests,
};
