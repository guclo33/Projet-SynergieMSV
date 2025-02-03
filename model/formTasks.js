const pool = require("./database");


const createForm = async (form, info) => {
    const fullName = info.firstName + " " + info.lastName;
    const client = await pool.connect(); // Obtenir une connexion du pool

    try {
        await client.query('BEGIN'); // Commencer la transaction

        const result = await client.query(
            "SELECT id, leader_id FROM client WHERE nom_client = $1 AND email = $2", 
            [fullName, info.email]
        );

        console.log("RESULT", result);

        let client_id;
        let form_id;

        if (result.rows.length > 0) {
            client_id = result.rows[0].id;
            const leader_id = result.rows[0].leader_id;

            const form_result = await client.query(
                "INSERT INTO questionnaire (client_id, form) VALUES ($1, $2::jsonb) RETURNING id", 
                [client_id, form]
            );

            form_id = form_result.rows[0].id;
            console.log("NEW FORM ID", form_id);

            await client.query(
                "INSERT INTO questionnaire_client (client_id, questionnaire_id) VALUES ($1, $2)",
                [client_id, form_id]
            );

            await client.query("UPDATE client SET date_presentation = $1 WHERE id = $2", [info.date_presentation, client_id])

            if (!leader_id) {
                await client.query(
                    "UPDATE client SET leader_id = $1 WHERE id = $2", 
                    [info.leader_id, client_id]
                );
            }

            const exist = await client.query(
                "SELECT id FROM groupe_clients WHERE groupe_id = $1 AND client_id = $2", 
                [info.group_id, client_id]
            );

            if (exist.rows.length === 0) {
                await client.query(
                    "INSERT INTO groupe_clients (groupe_id, client_id) VALUES ($1, $2)", 
                    [info.group_id, client_id]
                );
            }
        } else {
            const result2 = await client.query(
                "INSERT INTO client (nom_client, email, leader_id, phone, date_presentation) VALUES($1, $2, $3, $4, $5) RETURNING id", 
                [fullName, info.email, info.leader_id, info.phone, info.date_presentation]
            );
            
            client_id = result2.rows[0].id;
            console.log("CLIENT_ID==", client_id)

            const form_result = await client.query(
                "INSERT INTO questionnaire (client_id, form) VALUES ($1, $2::jsonb) RETURNING id", 
                [client_id, form]
            );

            form_id = form_result.rows[0].id;

            console.log("NEW FORM ID", form_id);

            await client.query(
                "INSERT INTO questionnaire_client (client_id, questionnaire_id) VALUES ($1, $2)",
                [client_id, form_id]
            );

            const exist = await client.query(
                "SELECT id FROM groupe_clients WHERE groupe_id = $1 AND client_id = $2", 
                [info.group_id, client_id]
            );

            if (exist.rows.length === 0) {
                await client.query(
                    "INSERT INTO groupe_clients (groupe_id, client_id) VALUES ($1, $2)", 
                    [info.group_id, client_id]
                );
            }
        }

        await client.query('COMMIT'); 
        return form_id
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error("Erreur lors de l'accès à la base de données :", error);
    } finally {
        client.release(); 
    }
};

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