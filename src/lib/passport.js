const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const helpers = require('../lib/helpers');

const User = require('../models/User');

//SIGNING
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const user = await User.findOne({ username: username });
    if (!user) {
        done(null, false, req.flash('message', 'Credenciales no coinciden'));
    }
    else {
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        }
        else {
            done(null, false, req.flash('message', 'Credenciales no coinciden'));
        }
    }
}));
//SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const pass = await helpers.encryptPassword(password);
    const newUser = new User({
        name: nombre,
        apellido: apellido,
        username: username,
        password: pass
    });
    await newUser.save();
    return done(null, newUser, req.flash('success', 'Bienvenido ' + nombre+" "+apellido));
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});