const pool = require("./database");
const s3Client = require('../server/config/s3-config');
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner');
require("dotenv").config();

const getLeaderData = async (id) => {
    const info = await pool.query("SELECT * FROM client left JOIN leader ON client.leader_id = leader.id and client.leader_id is not null JOIN users ON users.client_id = client.id WHERE users.id = $1", [id])

    const profile = await pool.query("SELECT * FROM profile WHERE client_id = (SELECT client_id FROM users WHERE id = $1) ORDER BY profile.id DESC LIMIT 1", [id])

    const equipe = await pool.query(" SELECT id, nom_client as nom, email, phone FROM client WHERE leader_id = (SELECT leader_id FROM client JOIN users ON client.id = users.client_id WHERE users.id = $1);", [id])

    const equipeProfiles = await pool.query("SELECT p.* FROM profile p JOIN client c ON p.client_id = c.id WHERE c.leader_id = (SELECT leader_id FROM client JOIN users ON client.id = users.client_id WHERE users.id = $1) AND p.id = ( SELECT MAX(id) FROM profile WHERE client_id = p.client_id)", [id])

    const data = {
        info: info.rows[0],
        profile: profile.rows[0],
        equipe : equipe.rows,
        equipeProfiles : equipeProfiles.rows
    }

    return data;
}




module.exports = {
    getLeaderData,
    
}
