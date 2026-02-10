import sqlite3 from 'sqlite3';

export default class KVStoreSqlite {

    constructor(db) {
        this.db = new sqlite3.Database('./test.sqlite');
        this.db.run(`CREATE TABLE IF NOT EXISTS items (
                    id TEXT PRIMARY KEY,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    }

    close() {
        this.db.close();
    }

    retrieve(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error('Error querying:', err);
                    reject(err);
                    return;
                }
                //console.log('Items:', row);
                resolve(row);
            });
        });
    }

    generateID() {
        return crypto.randomUUID({ version: 7 }).replaceAll('-', '');
    }

    store(data) {
        return new Promise((resolve, reject) => {
            const id = this.generateID();
            this.db.run('INSERT INTO items (id, content) VALUES (?, ?)', [id, data],
                (err) => {
                    if (err) {
                        console.error('Error inserting:', err);
                        reject(err);
                        return;
                    }
                    console.log('Item inserted with ID:', id);
                    resolve({id: id});
                });
        });
    }
}
