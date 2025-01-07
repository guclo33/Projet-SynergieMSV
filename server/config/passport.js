const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { loginQuery, findUserById } = require('../../model/tasks');


passport.use(
    new LocalStrategy(
        { usernameField: 'usernameOrEmail', passwordField: 'password' }, 
        async (usernameOrEmail, password, done) => {
            try {
                
                const user = await loginQuery(usernameOrEmail);

                if (user.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });
                }

                const isMatch = await bcrypt.compare(password, user.rows[0].password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                
                return done(null, user.rows[0]);
            } catch (err) {
                return done(err);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    
    try {
        const userRows = await findUserById(id);
        const user = userRows.rows[0];
        
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err);
    }
});

module.exports = passport