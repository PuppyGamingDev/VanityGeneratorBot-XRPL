require("dotenv/config");
const sqlite3 = require("sqlite3").verbose();
const uuid = require("uuid");

module.exports = class Database {
    constructor(updating = false) {
        this.queue = {};
        this.db = null;
        this.dbOpen = false;
        this.running = false;
        if (!updating) {
            this.initial();
        }
    }

    openDB() {
        if (!this.dbOpen) {
            this.db = new sqlite3.Database(process.env.DBPATH + "database.db");
            this.dbOpen = true;
        }
    }

    closeDB() {
        if (this.dbOpen) {
            this.db.close();
            this.dbOpen = false;
        }
    }

    async initial() {
        this.openDB();
        this.db.serialize(() => {
            this.db.run("CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, userid TEXT, request TEXT, finished INTEGER)");
        });
        await this.loadFromDatabase();
        const { updateRequests } = require("../utilities/Generator");
        updateRequests();
        this.closeDB();
    }

    async loadFromDatabase() {
        const { addRequest } = require("../utilities/Storage");

        return new Promise((resolve, reject) => {
            this.db.each(
                "SELECT * FROM requests WHERE finished = 0",
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        addRequest(row.id, row.userid, row.request, row.finished);
                    }
                },
                (err, rowCount) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        console.log(`Loaded ${rowCount} Requests`);
                        resolve();
                    }
                }
            );
        });
    }

    add(query, params) {
        const id = uuid.v4();
        this.queue[id] = { query: query, params: params };
        if (!this.running) this.saveQueue();
    }

    async saveQueue() {
        while (Object.entries(this.queue).length > 0) {
            this.running = true;
            this.openDB();
            for (const [id, request] of Object.entries(this.queue)) {
                await this.run(request.query, request.params);
                delete this.queue[id];
            }
            this.running = false;
            this.closeDB();
        }
    }

    async run(query, params) {
        return new Promise((resolve, reject) => {
            if (params) {
                this.db.run(query, params, (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                this.db.run(query, (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    async updateQuery(query) {
        this.openDB();
        this.db.run(query, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        this.closeDB();
    }
};
