import { Pool } from "pg";

const client = new Pool({
    connectionString: "postgres://postgres:postgres@localhost/lifefeed"
});

export default client;
