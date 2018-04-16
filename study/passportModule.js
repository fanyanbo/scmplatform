var passport = require('passport');
var logger  = require('../common/logger');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new localStrategy({
        usernameField:'loginname',
        passwordField:'password'
    },function(username,password,done){

    var user = {
        id: "1",
        username: "admin",
        password: "pass"
    };
    console.log("param username = " + username);
    console.log("local username = " + user.username);

    if (username !== user.username) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null,user);
}));

// require('./study/passportModule');
//
// app.use(passport.initialize());
// app.use(passport.session());

// app.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//            if (err) {
//                return next(err);
//            }
//            logger.info(user);
//            logger.info(info);
//            if (!user) {
//                return res.render('index', { title: 'Express 111' });
//            }
//            req.logIn(user, function(err) {
//                if (err) {
//                    return next(err);
//                }
//                return res.render('index', { title: 'Express 222' });;
//            });
//        })(req, res, next);
//    });
//
// var isAuthenticated = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.render('index', { title: 'Express 333' });;
// }
//
// app.post('/verify', isAuthenticated, function (req, res, next){
//   res.json("wagaga");
// });
