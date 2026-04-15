// npm i better-sqlite3
// npm i --save-dev @types/better-sqlite3

import Database from 'better-sqlite3';

const db = new Database('banco.db', {
    verbose: console.log,
    timeout: 10000
});

// db.exec('CREATE TABLE IF NOT EXISTS pessoas (nome TEXT, email TEXT, hobbies TEXT)')

export default db;