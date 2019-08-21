const LocalStrategy = require('passport-local').Strategy;
const {Member} = require('./models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    const authenticate = async(email, password, done) => {
        Member.findOne({email})
            .then(user => {
                if (!user) return done(null, false, {message: 'No user with the email.'})
                
                try {
                    bcrypt.compare(password, user.password)
                        .then(res => {
                            if (!res) return done(null, false, {message: 'Wrong password'})
                            return done(null, user);
                        })
                        .catch(err => done(err));
                } catch(err) { done(err) }

            })
            .catch( err  => done(err) );
    }

    passport.use( new LocalStrategy({ usernameField: 'email'}, authenticate) );
    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser((id, done) => {
        Member.findById(id).then(user => done(null, user));
    });
}