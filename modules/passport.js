const passport = require('passport');
const bcrypt = require('bcrypt');
const accM = require('../models/account-m');
const MyStrategy = require('./myStrategy');

passport.serializeUser((user, done) => {
    done(null, user.UserName);
});
passport.deserializeUser(async (user, done) => {
    const acc = await accM.get(user);
    if (acc){
        return done(null, acc);
    }
    done('invalid');
});

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new MyStrategy(async (un, pw, done) => {
        try{
            const user = await accM.get(un);
            const rs = await bcrypt.compare(pw, user.Pass);
            if (rs){
                return done(null, user);
            }
            done('invalid auth', null);
        }
        catch (err){
            done(err);
        }
    }))
}