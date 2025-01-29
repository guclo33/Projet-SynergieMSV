const pool = require("./database");


createForm = async (form, info) => {
    const fullName = info.firstName + " " + info.lastName
    
    try{
        const result = await pool.query("SELECT id, leader_id FROM client WHERE nom_client = $1 AND email = $2", [fullName, info.email]);

        console.log("RESULT", result)

        if (result.rows.length > 0) {
            const client_id = result.rows[0].id;

            const leader_id = result.rows[0].leader_id
            
            const form_id = await pool.query("INSERT INTO questionnaire (client_id, form) VALUES ($1, $2::jsonb) RETURNING id", [client_id, form])

            console.log("NEW FORM ID", form_id)

            await pool.query("INSERT INTO questionnaire_client (client_id, questionnaire_id) VALUES ($1, $2)",[client_id, form_id.rows[0].id])

            if (!leader_id) {
                await pool.query("UPDATE client SET leader_id = $1 WHERE id = $2", [info.leader_id, client_id])
            }

            //Metre une logique pour vérifier le leader et ajuster le client ID

            const exist = await pool.query("SELECT id FROM groupe_clients WHERE groupe_id = $1 AND client_id = $2" [info.group_id, client_id]);

            if(exist.rows.length = 0 ){

                await pool.query("INSERT INTO groupe_clients (groupe_id, client_id) VALUES ($1, $2)", [info.group_id, client_id])
            }

            



        }
        else {
            
            const result2 = await pool.query("INSERT INTO client (nom_client, email, leader_id, phone, date_presentation) VALUES($1, $2, $3, $4, $5) RETURNING id ", [fullName, info.email, info.leader_id, info.phone, info.date_presentation ])

            const client_id = result2.rows[0].id;

            const form_id = await pool.query("INSERT INTO questionnaire (client_id, form) VALUES ($1, $2::jsonb) RETURNING id", [client_id, form])

            console.log("NEW FORM ID", form_id)

            await pool.query("INSERT INTO questionnaire_client (client_id, questionnaire_id) VALUES ($1, $2)",[client_id, form_id.rows[0]])

            //Metre une logique pour vérifier le leader et ajuster le client ID

            const exist = await pool.query("SELECT id FROM groupe_client WHERE groupe_id = $1 AND client_id = $2" [info.group_id, client_id]);

            if(exist.rows.length >0 ){

                await pool.query("INSERT INTO groupe_clients (groupe_id, client_id) VALUES ($1, $2)", [info.group_id, client_id])
            }


        }


    } catch(error){
        console.error("Erreur lors de l'accès à la base de données :", error)
    }
}

const createPreformUrl = async(formId, formData) => {
    
    try {
        const response = await pool.query("SELECT id FROM prefilledForm WHERE data @> $1::jsonb", [JSON.stringify(formData)])
        if(response.rows.length > 0) {
            console.log("✅ Formulaire déjà existant :", response.rows[0]);
            return response.rows[0];
        } else {
             
             const insertResponse = await pool.query(
                "INSERT INTO prefilledForm (id, data) VALUES ($1, $2::jsonb) RETURNING id",
                [formId, JSON.stringify(formData)]
            );

            console.log("✅ Nouveau formulaire enregistré :", insertResponse.rows[0]);
            return insertResponse.rows[0]; 
        }
    } catch(error) {
        console.log(error)
    }
    
    
}

const getPreformData = async(formId) => {
    const data = await pool.query("SELECT data FROM prefilledForm WHERE id = $1", [formId])
    
    console.log("data de preform", data)
    return data.rows
}

module.exports = {createPreformUrl, getPreformData, createForm}