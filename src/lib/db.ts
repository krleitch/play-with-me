import pg from 'pg';
const { Client, Pool } = pg;

console.log('TACOS');
console.log(import.meta.env.VITE_PGDATABASE);

const pool = new Pool({
	database: import.meta.env.VITE_PGDATABASE,
	user: import.meta.env.VITE_PGUSER,
	host: import.meta.env.VITE_PGHOST,
	port: Number(import.meta.env.VITE_PGPORT || 5432),
	password: import.meta.env.VITE_PGPASSWORD
});

export const connectToDB = async () => await pool.connect();
