const {Pool} = require("pg");
require("dotenv").config()



const pool = new Pool({
    user: process.env.DB_RENDER_USER,
    host: process.env.DB_RENDER_HOST,
    database: process.env.DB_RENDER_DATABASE,
    password: process.env.DB_RENDER_PASSWORD,
    port: process.env.DB_RENDER_PORT, 
    ssl: {
        rejectUnauthorized: false, 
    },
})
    
    
    /*{
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}*/;



module.exports = pool