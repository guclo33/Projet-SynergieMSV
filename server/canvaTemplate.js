const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require("url");
const crypto = require("crypto");
require('dotenv').config();
const { exec } = require('child_process');
const { updateToken, fetchToken } = require('../model/tasks');

const codeVerifier = crypto.randomBytes(96).toString("base64url");
const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64url");


const clientId = process.env.CANVA_CLIENTID;
const clientSecret = process.env.CANVA_SECRETID;
const authURL = process.env.NODE_ENV === "production" ? process.env.CANVA_RENDER_AUTHURL + codeChallenge : process.env.CANVA_AUTHURL + codeChallenge;


let accessToken = "";
let refreshToken = "";

const getAuthUrl =() => {

    return authURL
}

const getAuthUrlProfile =() => {
    const authUrlProfile = process.env.NODE_ENV === "production" ? process.env.CANVA_RENDER_AUTHURL_PROFILE + codeChallenge : process.env.CANVA_AUTHURL_PROFILE + codeChallenge
    return authUrlProfile
}

const getUser = (req, res) => {
   
    /*if(req.session.user.token) {
        const user = {
            id: req.session.user.id,
            username : req.session.user.username,
            role : req.session.user.role,
            email : req.session.user.email,
            accessToken : req.session.user.token.accessToken,
            refreshToken : req.session.user.token.refreshToken
        }
        console.log(`here is the user :`, user)
        return res.json(user)
        
    }*/

    const user = {
        id: req.session.user.id,
        username : req.session.user.username,
        role : req.session.user.role,
        email : req.session.user.email,
    
}
    
    

    console.log(`here is the user :`, user)
    return res.json(user)
}

/*const setAuthStatus = (req,res) =>{
    if(!req.session.user){
        req.session.user = {}
    }
    req.session.user ={canva : true}
    
}*/

const templateDataset = async (templateId, accessToken, refreshToken, authCode) => {
    const templateInfos = await fetch(`https://api.canva.com/rest/v1/brand-templates/${templateId}/dataset`,   {
    method: "GET",
    credentials: 'include',
    headers: {"Authorization" : `Bearer ${accessToken}`}
    });
        if (!templateInfos.ok) {
            console.error("Error fetching template information:", templateInfos.status, templateInfos.statusText);
            return;
        }


        const info = await templateInfos.json();
        console.log (info)

        const query = "UPDATE canva_token SET accesstoken = $1, refreshtoken = $2, authcode = $3, templateid = $4"
        const value = [accessToken, refreshToken, authCode, templateId ]

        await updateToken(query, value)
        
        await fs.writeFileSync('accessToken.json', JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken, templateId : templateId }));
        
        
    }; 


const template = async (accessToken, refreshToken, authCode) => {
    let templateId = ""
    if (!accessToken) {
        console.error("Access token is undefined or missing.");
        return;
    }
    try {
        
        const getTemplateId = await fetch("https://api.canva.com/rest/v1/brand-templates",
            {
                method: "GET",
                headers : {
                    "Authorization" : `Bearer ${accessToken}`
                },
                credentials: 'include',
            }
        );
        const templateIdInfos = await getTemplateId.json()
        templateId = await templateIdInfos.items[0].id;
        console.log(templateIdInfos);
        
        try {
            await templateDataset(templateId, accessToken, refreshToken, authCode);
        } catch (err) {
            console.log("Could not get template dataset", err)
        }
        

    } catch(err) {
        console.log("Could not get template id", err)
    }
     
}

const connectCanva = async (req,res, next) => {
    const authCode = req.query.code;
    const state = req.query.state;
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://127.0.0.1:3000';
    const redirectURL = req.session.redirectURL;
    const redirectURI = `${apiUrl}/api/canva/auth`;
    
     

    if(authCode) {
        try{
        console.log("fetching api canva")
        const credentials = `${clientId}:${clientSecret}`;
        const base64Credentials = Buffer.from(credentials).toString('base64');
        const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
            method: "POST",
            headers: {
              "Authorization": `Basic ${base64Credentials}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: 'include',
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code_verifier: codeVerifier,
                code: authCode, 
                redirect_uri: redirectURI
            })
        });
        const data = await response.json();
        console.log("data: ", data)
        accessToken = await data.access_token;
        refreshToken = await data.refresh_token;

        

        /*req.session.user.token = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };*/

        // Save the session after storing the token
        req.session.save((err) => {
            if (err) {
                console.error("Session save error", err);
            }
        });


        await template(accessToken, refreshToken, authCode);

        

        console.log(`accessToken = ${accessToken}. refreshToken = ${refreshToken}` )
        //await res.send(data);
        
        res.redirect(`${state}?auth=true`)
        
        
    
        
        
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching token", err);
      }
    } else {
      res.status(404).send("Could not get code");
    }

}
/*
const connectCanvaDetail = async (req,res, next) => {
    const authCode = req.query.code;
    const state = req.query.state;
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://127.0.0.1:3000';
    const redirectURL = req.session.redirectURL;
    const redirectURI = `${apiUrl}/api/details/canva`;
    
    
    console.log("authCode===", authCode)

    if(authCode) {
        try{
        console.log("fetching api canva")
        const credentials = `${clientId}:${clientSecret}`;
        const base64Credentials = Buffer.from(credentials).toString('base64');
        const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
            method: "POST",
            headers: {
              "Authorization": `Basic ${base64Credentials}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: 'include',
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code_verifier: codeVerifier,
                code: authCode, 
                redirect_uri: redirectURI
            })
        });
        const data = await response.json();
        console.log("data: ", data)
        accessToken = await data.access_token;
        refreshToken = await data.refresh_token;

        /*req.session.user.token = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };

        // Save the session after storing the token
        req.session.save((err) => {
            if (err) {
                console.error("Session save error", err);
            }
        });


        await template(accessToken, refreshToken);

        

        console.log(`accessToken = ${accessToken}. refreshToken = ${refreshToken}` )
        //await res.send(data);
        
        


        res.redirect(`${state}`)
        
        
    
        
        
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching token", err);
      }
    } else {
      res.status(404).send("Could not get code");
    }

}*/



const generateTemplate = async (req, res) => {
    const { clientid } = req.params;
    console.log("clientid", clientid);

    try {
        exec(`python ./GenerateurTexte/canvaAutofillExecute.py ${clientid}`, (error, stdout, stderr) => {
            if (error) {
                console.error("Erreur d'exécution:", error);
                return res.status(500).json({ message: "Erreur d'exécution du script Python" });
            }

            

            // Utiliser une expression régulière pour extraire l'URL du tuple
            const match = stdout.match(/(https:\/\/www\.canva\.com\/api\/design\/[^\s]+)/);
            

            if (match) {
                const editUrl = match[0]; // L'URL est capturée dans le premier groupe de l'expression régulière
                console.log("URL générée:", editUrl);

                if (stderr) {
                    console.error("Messages stderr :", stderr);
                }

                // Renvoyer l'URL au client sous forme de JSON
                return res.status(200).json({ message: "Template généré avec succès", editUrl: editUrl });
            } else {
                console.error("Impossible de trouver l'URL dans la sortie");
                return res.status(500).json({ message: "Erreur de parsing des données" });
            }
        });
    } catch (error) {
        console.log("Erreur lors de la génération du template:", error);
        return res.status(500).json({ message: "Erreur lors de la génération du template", error });
    }
};





module.exports = {
    
    connectCanva,
    getAuthUrl,
    getUser,
    getAuthUrlProfile,
    
}

