// lib/db.js
const { Pool } = require('pg');

// Configuration du pool de connexions PostgreSQL
let poolConfig;

if (process.env.DATABASE_URL) {
    // Option 1: Utiliser une chaîne de connexion complète
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false
    };
} else {
    // Option 2: Utiliser des paramètres individuels
    poolConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false
    };
}

const pool = new Pool(poolConfig);

// Module d'accès à la base de données
const db = {
    query: async (text, params) => {
        const client = await pool.connect();
        try {
            console.log('SQL Query:', text);
            console.log('Parameters:', params);
            const result = await client.query(text, params);
            return result.rows;
        } finally {
            client.release();
        }
    },
    pool
};

export default db;