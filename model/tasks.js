const pool = require("./database");

const createUserQuery = async (userName, password, email) => {
    return await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [userName, password, email] )
}

const loginQuery = async (userNameOrEmail) =>  {
    return await pool.query("SELECT id, role, password, username, email FROM users WHERE (email = $1 OR username = $1)", [userNameOrEmail]);
}

const getAdminHomeData = async () => {
    const leadersData = await pool.query("SELECT DISTINCT l.id as leaderid, l.client_id as clientid,l.active as active,c.nom_client as nom, c.email as email, c.phone as phone, c.date_presentation as date_presentation, c.echeance as echeance, c.priorite as priorite FROM leader l JOIN client c ON l.client_id = c.id ORDER BY c.priorite" );

    const clientsData = await pool.query("SELECT c.id, c.nom_client, c.email, c.leader_id, c.phone, c.active, c.priorite, c.additional_infos, c.date_presentation, c.echeance,  l.nom_leader FROM client c JOIN leader l ON c.leader_id = l.id ORDER BY id")

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

const getObjectifsData = async (clientid, id) => {
    console.log("CLIENTID", clientid, "ID", id)
    
    if(clientid) {
    const objectifs = await pool.query("SELECT * FROM client LEFT JOIN objectifs on client.id = objectifs.client_id AND client.objectifs_id IS NOT NULL WHERE client.id = $1", [clientid])

    const progres = await pool.query("SELECT * FROM progres WHERE client_id = $1", [clientid])

    const data = {
        objectifs,
        progres
    }

    return data
}
    const objectifs = await pool.query("select u.id, c.nom_client,o.id as objectifs_id, o.objectifs, o.actions, o.new_ideas, o.section1_titre, o.section1, o.section2_titre, o.section2 from users u join client c on u.client_id = c.id join objectifs o on c.id = o.client_id where u.id = $1", [id])

    const progres = await pool.query("select u.id as client_id, c.nom_client,p.id, p.progres, p.completed, p.created_date from users u join client c on u.client_id = c.id join progres p on c.id = p.client_id where u.id = $1", [id])

    const data = {
        objectifs,
        progres
    }
    console.log("DATA", data)
    return data

}

const createObjectifsData = async ( query, queryArray, value) => {
    console.log("QUERY:", query, "queryARRAY", queryArray, "VALUE", value)
    if(value) {
        return await pool.query(query, [value])
    }

    console.log("JE FAIS LA QUERY SANS VALUE")
    return await pool.query(query, queryArray)
    
}

const updateObjectifsData = async (query, queryArray, prog_id, value) => {
    if(prog_id) {
        console.log("updating with value", value, "and id", prog_id)
        return await pool.query(query, [value, prog_id])
    }
    return await pool.query(query, queryArray)
}

const deleteObjectifsData = async (prog_id) => {
    return await pool.query("DELETE FROM progres WHERE id = $1", [prog_id])
}

const getRoadmapData = async () => {
    return await pool.query("SELECT c.nom_client as nom, c.id, c.leader_id as leader, t.task, t.category, t.is_completed FROM client c JOIN todos t ON c.id = t.client_id;")
}

const updateRoadmapTodos = async(is_completed, clientid, task)=> {
    
    return await pool.query(`UPDATE todos SET is_completed = $1 WHERE client_id = $2 AND task=$3`, [is_completed, clientid, task])
}

const addTodosQuery = async (clientid, category, task, is_default) => {
    if(!is_default){
        return await pool.query(`INSERT INTO todos (client_id, task, category) VALUES  ($1, $2, $3)`, [clientid, task, category])
    }

    return await pool.query(`INSERT INTO default_tasks (task, category) VALUES ($1, $2)`, [task, category])

}

const deleteRoadmapTodosQuery = async (clientid, task, delete_default) => {
    if(!delete_default) {
        return await pool.query(`DELETE FROM todos WHERE client_id = $1 AND task = $2`, [clientid,task])
    }
    await pool.query(`DELETE FROM todos WHERE task=$1`, [task])
    await pool.query(`DELETE FROM default_tasks WHERE task=$1`, [task])

    return
}

const updateOverview = async (date_presentation, echeance,  priorite, id, active) => {
    await pool.query("UPDATE client SET date_presentation = $1, echeance = $2, priorite = $3 WHERE id = $4", [date_presentation, echeance,  priorite, id ])
    await pool.query("UPDATE client SET active = $1 WHERE id = $2", [active, id])
    return {success:true}
}

const getDetailsData = async (clientid, id) => {
    //pour USER et Leader
    
    if(!clientid) {
        const info = await pool.query("SELECT * FROM client left JOIN profile ON client.id = profile.client_id and client.profile_id is not null left JOIN leader ON client.leader_id = leader.id and client.leader_id is not null JOIN users ON users.client_id = client.id WHERE users.id = $1 ORDER BY profile.id DESC LIMIT 1", [id])

    console.log("info", info)

    if(info.rows.length === 0) {
        const info = await pool.query("SELECT * FROM client JOIN profile ON client.id = profile.client_id JOIN users ON client.id = users.client_id where users.id = $1", [id])
        const data = {
            info: info.rows[info.rows.length -1]
        }
        return data
    }
    
    const equipe = await pool.query(" SELECT id, nom_client as nom, email, phone FROM client WHERE leader_id = (SELECT leader_id FROM client JOIN users ON client.id = users.client_id WHERE users.id = $1);", [id])

    const data = {
        info: info.rows[0],
        equipe : equipe.rows
    }
    console.log("voici le detailsData:", data)
    return data
    }

    //Pour Admin

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

const createGroup = async (group_name, have_leader, nom_leader, leader_id, members_ids, date_presentation) => {

    try {
        
        const result = await pool.query(
            "INSERT INTO groupes (group_name, have_leader, nom_leader, leader_id, date_presentation) VALUES($1, $2, $3, $4, $5) RETURNING id",
            [group_name, have_leader, nom_leader, leader_id, date_presentation]
        );

        const groupe_id = result.rows[0].id;
        console.log("Nouvel ID du groupe :", groupe_id);

        
        if (members_ids.length > 0) {
            await Promise.all(
                members_ids.map(id => 
                    pool.query(
                        "INSERT INTO groupe_clients (groupe_id, client_id) VALUES($1, $2)",
                        [groupe_id, id]
                    )
                )
            );
        }

        console.log("Tous les clients ont été ajoutés au groupe !");
    } catch (error) {
        console.error("Erreur lors de la création du groupe :", error);
        throw error; 
    }
};
    


const createLeader = async () => {

}



module.exports = {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery, getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData, createGroup, createLeader}