require('babel-register');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
    //pour faire fonctionner les flash on a besoin des Modules 'connect-flash, express-session, express-mysql-session 
    // et la connexion a la Bd qui se trouve ds (connect.js)'
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./connect');

//Initialisations
const app = express();

require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 8090);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/datefction')
}));
app.set('view engine', '.hbs');

//Middleware
    // MySQLStore() 
app.use(session({
    secret: 'mysqlnodeseession',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
    
            //on ajoute des middleware de passport et express-session pour s'authentifier a ntre compte 
        //Pour l'initialiser 'passport.initialize()' on va faire appel a ntre fichier 'passport' ds "lib" 
app.use(passport.initialize());
    //Pour utiliser les 'passport.initialize()' on doit les faits acompagne de 'session'
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})


//Routes
app.use('/admins', require('./controllers/admins'));
app.use(require('./controllers/authentify'));
app.use(require('./controllers/index'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Demarrer le server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});