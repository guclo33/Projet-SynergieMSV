const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { loginQuery, findUserById } = require('../../model/tasks');


passport.use(
    new LocalStrategy(
        { usernameField: 'usernameOrEmail', passwordField: 'password' }, 
        async (usernameOrEmail, password, done) => {
            try {
                console.log('Authenticating user:', usernameOrEmail);
                const user = await loginQuery(usernameOrEmail);

                if (user.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });
                }

                const isMatch = await bcrypt.compare(password, user.rows[0].password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                console.log(`passport user created wih : ${user.rows[0]}`)
                return done(null, user.rows[0]);
            } catch (err) {
                return done(err);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    console.log('Serializing user:', user)
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with id:', id);
    try {
        const userRows = await findUserById(id);
        const user = userRows.rows[0]
        console.log('User deserialized:', user);
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err);
    }
});

module.exports = passport