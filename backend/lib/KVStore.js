import KVStoreSqlite from './KVStoreSqlite.js'
import KVStoreCFKV from './KVStoreCFKV.js'

export default class KVStore {

    constructor() {
        switch(process.env.CF_WORKER) {
        case true:
            return new KVStoreCFKV();
            break;
        default:
            return new KVStoreSqlite();

        }
    }

}
