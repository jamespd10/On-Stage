const express = require('express');

require('dotenv').config();

require('./database');

const morgan = require('morgan');

const exhbs = require('express-handlebars');

const path = require('path');

const upload = require('express-fileupload');

const methodOverride = require('method-override');

const flash = require('connect-flash');

const fs = require('fs');

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const passport = require('passport');

//inicializaciones

const app = express();

//const http = require('http').createServer(app);

require('./lib/passport');

//settings

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
//NUEVO CODIGO
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
app.engine('.hbs', exhbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
//FIN DEL NUEVO CODIGO
/*app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));*/
app.set('view engine', '.hbs');

//middlewares

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/onstagedb',
    collection: 'mySessions'
});

app.use(session({
    secret: 's!c43ct',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
    resave: true,
    saveUninitialized: true,
    store: store
}));

app.use(morgan('dev'));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.use(express.json());

app.use(flash());

//app.use('/form', express.static(__dirname + '/index.html'));

app.use(upload(/*{
    limits: { fileSize: 50 * 1024 * 1024 },
}*/));

app.use(passport.initialize());

app.use(passport.session());

//global variables

app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/buscar'));
app.use('/profile', require('./routes/profile'));
app.use('/tags' ,require('./routes/tags'));
app.use('/streaming',require('./routes/streaming'));

//404
/*app.use(function(req, res, next){
    res.status(404).render('errors/404', {layout: 'errors'});
});
//500
app.use(function(err, req, res, next){
    res.status(500).send('algo salió mal :c');
});*/

//public

app.use(express.static(path.join(__dirname, 'public')));

//start server
const server=app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});

//socket io
const SocketIo = require('socket.io');
const io = SocketIo(server);

require('./socket')(io);