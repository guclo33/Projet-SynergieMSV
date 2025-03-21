const pool = require("./database");

const createUserQuery = async (userName, password, email) => {
    return await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [userName, password, email] )
}

const loginQuery = async (userNameOrEmail) =>  {
    return await pool.query("SELECT id, role, password, username, email FROM users WHERE (email = $1 OR username = $1)", [userNameOrEmail]);
}

const getAdminHomeData = async () => {
    const leadersData = await pool.query("SELECT DISTINCT l.id as leaderid, l.client_id as clientid,l.active as active,c.nom_client as nom, c.email as email, c.phone as phone, c.date_presentation as date_presentation, c.echeance as echeance, c.priorite as priorite FROM leader l JOIN client c ON l.client_id = c.id ORDER BY c.priorite" );

    const clientsData = await pool.query("SELECT c.id, c.nom_client, c.email, c.leader_id, c.phone, c.active, c.priorite, c.additional_infos, c.date_presentation, c.echeance,  l.nom_leader, array_agg(p.profile_id) AS profile_ids, array_agg(f.questionnaire_id) as form_ids FROM client c LEFT JOIN leader l ON c.leader_id = l.id left join questionnaire_client f on c.id = f.client_id left join client_profile p on c.id = p.client_id group by c.id, c.nom_client, l.nom_leader ORDER BY c.id")

    const groupesData = await pool.query("SELECT * from groupes ORDER BY id")

    const groupesClients = await pool.query("SELECT * from groupe_clients ORDER BY id")

    const data = {
        leadersData,
        clientsData,
        groupesData : {
            groupesData,
            groupesClients
        }
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

const updateOverview = async ( id, active) => {
    console.log("updating overview with", id, active)
    await pool.query("UPDATE client SET active = $1 WHERE id = $2", [active, id])
    return {success:true}
}

const getDetailsData = async (clientid, id) => {
    //pour USER et Leader
    
    if(!clientid) {
        const info = await pool.query("SELECT * FROM client left JOIN profile ON client.id = profile.client_id and client.profile_id is not null left JOIN leader ON client.leader_id = leader.id and client.leader_id is not null JOIN users ON users.client_id = client.id WHERE users.id = $1 ORDER BY profile.id DESC LIMIT 1", [id])

    

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

    const info = await pool.query("SELECT *, profile.id AS profileId FROM client left JOIN client_profile on client.id = client_profile.client_id left join profile ON client_profile.profile_id = profile.id left JOIN leader ON client.leader_id = leader.id where client.id = $1 ORDER BY profile.id DESC LIMIT 1", [clientid])

    

    
    //À améliorer pour s'ajuster à la nouvelle formule de Groupe
    const equipe = await pool.query("SELECT id, nom_client as nom, email, phone FROM client WHERE leader_id = (SELECT leader_id FROM client WHERE id = $1)", [clientid])

    const group = await pool.query("SELECT * FROM groupes WHERE id IN (SELECT groupe_id FROM groupe_clients WHERE client_id = $1) ORDER BY id DESC LIMIT 1", [clientid])

    const form = await pool.query("SELECT form FROM questionnaire WHERE client_id = $1 ORDER BY id DESC", [clientid])
    

    const data = {
        info: info.rows[0],
        equipe : equipe.rows,
        group : group.rows[0],
        form : form.rows
    }
    
    return data
}

const updateDetailsGeneralInfosQuery = async (email, phone, price_sold, active, additional_infos, clientid) =>{
    await pool.query("UPDATE client SET email = $1, phone = $2 WHERE id = $3; ", [email, phone, clientid]);
    await pool.query("UPDATE leader SET price_sold = $1, active = $2, additional_infos = $3 WHERE client_id = $4",[price_sold,active, additional_infos, clientid])
    return {success:true}
    
}

const updateProfile = async (query, value, profile_id) => {
    if(value&& value.bleu){
        console.log("updating DB for colours")
        return await pool.query(query, [value.bleu, value.rouge, value.jaune, value.vert, profile_id])
    }
    
    await pool.query(query, [value, profile_id])
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
    


const createLeader = async (nom_leader, email) => {
    return await pool.query("INSERT INTO leader (nom_leader, email) VALUES ($1, $2)", [nom_leader, email])
}

const updateGroup = async (group_id, group_name, have_leader, nom_leader,leader_id, date_presentation, active,ids_to_add,ids_to_remove) => {

    await pool.query("UPDATE groupes SET group_name = $1, have_leader = $2, nom_leader = $3, leader_id = $4, date_presentation = $5, active = $6 WHERE id = $7", [group_name, have_leader, nom_leader,leader_id, date_presentation, active, group_id])

    if(ids_to_add && ids_to_add.length>0){
        return await pool.query("INSERT INTO groupe_clients (groupe_id, client_id) SELECT $1, unnest($2::int[])", [group_id, ids_to_add])
    }

    if(ids_to_remove && ids_to_remove.length>0) {
        return await pool.query("DELETE FROM groupe_clients WHERE groupe_id = $1 AND client_id IN (SELECT unnest($2::int[]))", [group_id, ids_to_remove])
    }


}

const fetchToken = async () => {
    const data = await pool.query("SELECT * FROM canva_token")
    return data.rows[0]
}

const updateToken = async (query, value) => {
    console.log("Updating token with", query, value)
    await pool.query(query, value)
    console.log("Done updating Token")
    return
}

const getPromptSets = async () => {
    return await pool.query("SELECT prompt_set_name, MIN(prompt_set_id) as id FROM prompts GROUP BY prompt_set_name ORDER BY id");
};

const getPrompts = async (selectedSetName) => {
    if (!selectedSetName) return [];   
    return await pool.query("SELECT * FROM prompts WHERE prompt_set_name = $1 ORDER BY prompt_number", [selectedSetName]);
};

const createPrompts = async (selectedSetName, prompts) => {
    if (!selectedSetName) return null;
    console.log("selectedSetName:", selectedSetName);
    console.log("Creating prompts:", prompts.prompt_set_id, prompts.prompt_number, prompts.prompt_name, prompts.value);
    return await pool.query("INSERT INTO prompts (prompt_set_name, prompt_set_id, prompt_number, prompt_name, value) VALUES ($1, $2, $3, $4, $5) RETURNING id", [selectedSetName, prompts[0].prompt_set_id, prompts[0].prompt_number, prompts[0].prompt_name, prompts[0].value]);
};

const updatePrompt = async (selectedSetName, promptData) => {
    if (!selectedSetName) return null;
    const existingPrompt = await pool.query("SELECT * FROM prompts WHERE prompt_set_name = $1 AND prompt_name = $2", [selectedSetName, promptData.prompt_name]);

    if (existingPrompt.rows.length === 0) {
        console.log("Creating prompt for update:", promptData);
        return pool.query("INSERT INTO prompts (prompt_set_name, prompt_name, value, prompt_set_id, prompt_number) VALUES ($1, $2, $3, $4, $5)", [selectedSetName, promptData.prompt_name, promptData.value, promptData.prompt_set_id, promptData.prompt_number]);
    };

    console.log("Updating prompt:", promptData);
    return await pool.query("UPDATE prompts SET value = $1, prompt_name=$2 WHERE prompt_set_name = $3 AND prompt_number = $4", [promptData.value, promptData.prompt_name, selectedSetName, promptData.prompt_number]);
};

const deletePrompt = async (selectedSetName, promptName) => {
    return await pool.query("DELETE FROM prompts WHERE prompt_set_name = $1 AND prompt_name = $2", [selectedSetName, promptName]);
};

module.exports = {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery, getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData, createGroup, createLeader, updateGroup, updateProfile, fetchToken, updateToken, getPromptSets, getPrompts, createPrompts, updatePrompt, deletePrompt};