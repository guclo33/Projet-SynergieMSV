const pool = require("./database");

const createUserQuery = async (userName, password, email) => {
    return await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [userName, password, email] )
}

const loginQuery = async (userNameOrEmail) =>  {
    return await pool.query("SELECT id, role, password, username, email FROM users WHERE (email = $1 OR username = $1)", [userNameOrEmail]);
}

const getAdminHomeData = async () => {
    const leadersData = await pool.query("SELECT l.id as leaderid, l.client_id as clientid,l.active as active,c.nom_client as nom, c.email as email, c.phone as phone, t.date_presentation as date_presentation, t.echeance as echeance, t.statut as statut, t.priorite as priorite FROM leader l JOIN client c ON l.client_id = c.id join leader_todo t on l.id = t.leader_id ORDER BY t.priorite" );

    const clientsData = await pool.query("SELECT id, nom_client FROM client")

    const data = {
        leadersData,
        clientsData
    }
    return data
}



const findUserById = async (id) => {
    
    return await pool.query('SELECT * FROM users WHERE id = $1', [id]);
};

const getOverviewData = async () => {
    return await pool.query("SELECT c.nom_client as nom, c.id as client_id, l.leader_id, l.date_presentation, l.echeance, l.statut, l.priorite FROM client c JOIN leader ON c.id = leader.client_id JOIN leader_todo l ON leader.id = l.leader_id ORDER BY statut")
}

const getRoadmapData = async () => {
    return await pool.query("SELECT c.nom_client as nom, c.id, c.leader_id as leader, t.task, t.category, t.is_completed FROM client c JOIN todos t ON c.id = t.client_id;")
}

const updateRoadmapTodos = async(is_completed, leaderid, task)=> {
    


    return await pool.query(`UPDATE todos SET is_completed = $1 WHERE client_id = (SELECT client_id from leader WHERE id = $2) AND task=$3`, [is_completed, leaderid, task])
}

const addTodosQuery = async (leaderid, category, task, is_default) => {
    if(!is_default){
        return await pool.query(`INSERT INTO todos (client_id, task, category) VALUES ((SELECT client_id FROM leader WHERE id = $1), $2, $3)`, [leaderid, task, category])
    }

    return await pool.query(`INSERT INTO default_tasks (task, category) VALUES ($1, $2)`, [task, category])

}

const deleteRoadmapTodosQuery = async (leaderid, task, delete_default) => {
    if(!delete_default) {
        return await pool.query(`DELETE FROM todos WHERE leader_id = $1 AND task = $2`, [leaderid,task])
    }
    await pool.query(`DELETE FROM todos WHERE task=$1`, [task])
    await pool.query(`DELETE FROM default_tasks WHERE task=$1`, [task])

    return
}

const updateOverview = async (date_presentation, echeance, statut, priorite, leader_id, active) => {
    await pool.query("UPDATE leader_todo SET date_presentation = $1, echeance = $2, statut = $3, priorite = $4 WHERE leader_id = $5", [date_presentation, echeance, statut, priorite, leader_id ])
    await pool.query("UPDATE leader SET active = $1 WHERE id = $2", [active, leader_id])
    return {success:true}
}

const getDetailsData = async (clientid) => {
    
    const info = await pool.query("SELECT * FROM client left JOIN profile ON client.id = profile.client_id and client.profile_id is not null left JOIN leader ON client.leader_id = leader.id and client.leader_id is not null where client.id = $1 ORDER BY profile.id DESC LIMIT 1", [clientid])

    console.log("info", info)

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



module.exports = {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery}