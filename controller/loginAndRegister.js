const bcrypt = require('bcryptjs');
const { createUserQuery, loginQuery} = require("../model/tasks");
const passport = require ("../server/config/passport")




const createUser = async (req, res) => {
    try {
        const {username, password, email} = req.body;

        const existingUser = await loginQuery(email);

        if(existingUser.rows.length > 0){
            res.status(400).send({message :"User already exist"})
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUserQuery(username, hashedPassword, email)
        res.status(201).send({message :"User created successfully!"})


    } catch (error) {
         res.status(500).send({message:`Could not create user: ${error.message}`})
    }
};

const login = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return res.status(500).send({ message: `Error: ${err.message}` });
            if (!user) return res.status(400).send({ message: info.message });
    
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Error during login:', err);
                    return res.status(500).send({ message: 'Login failed' });
                }
    
                
                const userResponse = {
                    id: user.id,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                };
    

                return res.status(200).send({
                    message: 'Login successful',
                    user: userResponse,
                });
            });
        })(req, res, next);
    };
    
    
    
    
    


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({ message: 'Unauthorized' });
};


const isAuthorizedAdmin = (req, res, next) => {
    
    const {id} = req.params;
    
    
    if (!req.isAuthenticated()) {
        return res.status(401).send({ message: "Unauthorized" });
    }
      

    if(!["admin", "superadmin"].includes(req.user.role)  || req.user.id !== Number(id)) {
        return res.status(403).send({message: "Forbidden: Role or ID does not match"});
    }
    
    
    return next();
}

const isAuthorizedLeader = (req, res, next) => {
    const {id} = req.params;
    
    if (!req.isAuthenticated()) {
        return res.status(401).send({ message: "Unauthorized" });
    }
      

    if(!["leader", "superadmin"].includes(req.user.role) || req.user.id.toString() !== id) {
        return res.status(403).send({message: "Forbidden: Role or ID does not match"});
    }
    
    return next();
}

const isAuthorizedUser = (req, res, next) => {
    const {id} = req.params;
    
    if (!req.isAuthenticated()) {
        return res.status(401).send({ message: "Unauthorized" });
    }
      

    if(!["user", "superadmin"].includes(req.user.role) || req.user.id.toString() !== id) {
        return res.status(403).send({message: "Forbidden: Role or ID does not match"});
    }
    
    
    return next();
}

    
    



module.exports = { createUser, login, isAuthenticated, isAuthorizedAdmin, isAuthorizedLeader, isAuthorizedUser};