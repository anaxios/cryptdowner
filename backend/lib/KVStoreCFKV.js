export default class KVStoreCFKV {

    constructor(env) {
        this.env = env;
        this.expirationTTL = 60 * 60 * 24 * 7;
    }

    close() {
        return;
    }

    async retrieve(id) {
        return await this.env.cryptdowner.get(id, {type: "json"});
    }

    generateID() {
        return crypto.randomUUID({ version: 7 }).replaceAll('-', '');
    }

    async store(data) {
        const id = this.generateID();
        const r = await this.env.cryptdowner.put(id, data, { expirationTtl: this.expirationTTL });
        return {id: id};
    }
}
