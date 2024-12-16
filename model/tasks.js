const pool = require("./database");

const createUserQuery = async (userName, password, email) => {
    return await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [userName, password, email] )
}

const loginQuery = async (userNameOrEmail) =>  {
    return await pool.query("SELECT id, role, password, username, email FROM users WHERE (email = $1 OR username = $1)", [userNameOrEmail]);
}

const getAdminHomeData = async () => {
    return await pool.query("SELECT l.id as leaderid, l.client_id as clientid, l.active as active, c.nom_client as nom, c.email as email, c.phone as phone FROM leader l JOIN client c ON l.client_id = c.id" )
}



const findUserById = async (id) => {
    
    return await pool.query('SELECT * FROM users WHERE id = $1', [id]);
};

const getOverviewData = async () => {
    return await pool.query("SELECT c.nom_client as nom, c.id as client_id, l.leader_id, l.date_presentation, l.echeance, l.statut, l.priorite FROM client c JOIN leader ON c.id = leader.client_id JOIN leader_todo l ON leader.id = l.leader_id ORDER BY statut")
}

const getRoadmapData = async () => {
    return await pool.query("SELECT c.nom_client as nom, l.leader_id, l.creation_messenger, l.date_confirme, l.questionnaire_envoye, l.creation_zoom, l.envoie_factures, l.recept_paiement, l.comptabilite, l.redaction_profil, l.profil_leader, l.pret_partage, l.powerpoint, l.mentimeter, l.planif_rencontres1, l.envoie_introspection, l.rencontres1, l.planif_rencontres2, l.envoie_questionnaire_objectifs, l.rencontres2, l.leader_profil_autres, l.leader_adapter, l.leader_suivi FROM client c JOIN leader ON c.id = leader.client_id JOIN leader_todo l ON leader.id = l.leader_id;")
}

const updateRoadmapTodos = async(query, value, leaderid)=> {
    return await pool.query(query, [value, leaderid])
}

const updateOverview = async (date_presentation, echeance, statut, priorite, leader_id) => {
    return await pool.query("UPDATE leader_todo SET date_presentation = $1, echeance = $2, statut = $3, priorite = $4 WHERE leader_id = $5", [date_presentation, echeance, statut, priorite, leader_id ])
}

const getDetailsData = async (clientid) => {
    
    const info = await pool.query("SELECT * FROM leader JOIN client ON leader.client_id = client.id JOIN profile ON client.profile_id = profile.id where client.id = $1", [clientid])

    if(info.rows.length === 0) {
        const info = await pool.query("SELECT * FROM client JOIN profile ON client.id = profile.client_id where client.id = $1", [clientid])
        const data = {
            info: info.rows[info.rows.length -1]
        }
        return data
    }
    
    const equipe = await pool.query(" SELECT id, nom_client as nom, email, phone FROM client WHERE leader_id = (SELECT leader_id FROM client WHERE id = $1);", [clientid])

    const data = {
        info: info.rows[0],
        equipe : equipe.rows
    }
    console.log("voici le detailsData:", data)
    return data
}

const updateDetailsGeneralInfosQuery = async (email, phone, price_sold, active, additional_infos, clientid) =>{
    await pool.query("UPDATE client SET email = $1, phone = $2 WHERE id = $3; ", [email, phone, clientid]);
    await pool.query("UPDATE leader SET price_sold = $1, active = $2, additional_infos = $3 WHERE client_id = $4",[price_sold,active, additional_infos, clientid])
    return {success:true}
    
}

const updateUserInfosQuery =  async (username, email, id) => {
    return await pool.query("UPDATE users SET username = $1, email = $2 WHERE id = $3", [username, email, id])
}

const updateUserPasswordQuery = async (password, id) => {
    return await pool.query("UPDATE users SET password = $1 WHERE id = $2", [password, id])
}



module.exports = {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery}