const pool = require("./database");

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

module.exports = {createPreformUrl, getPreformData}