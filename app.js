const cookieParser            = require( 'cookie-parser' ),
      session                 = require( 'express-session' )
      flash                   = require( 'connect-flash' ),
      mongoose                = require( 'mongoose' ),
      express                 = require( 'express' ),
      morgan                  = require( 'morgan' ),
      app                     = express();
      methodOverride          = require('method-override'),
      passport                = require('passport'),
      striptags               = require('striptags');

// middlewares
app.use( morgan('dev') );
app.use(methodOverride('_method'));
app.use( express.json() );
app.use( express.urlencoded({limit: '50mb', extended: false}) );
app.set( 'view engine', 'pug' );
app.use( express.static( 'public' ) );
app.use( '/uploads', express.static(__dirname + '/uploads') );
app.locals.moment = require('moment');
app.use( cookieParser('secret') );

app.use( session({
    cookie: { maxAge: 6000000 },
    secret: 'Hello world',
    resave: false,
    saveUninitialized: true
}) );

app.use( passport.initialize() );
app.use ( passport.session() ); 

// flash messages
app.use( flash() );

// middleware for flash messages
app.use(async (req, res, next) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    const validators = require('./validators');

    res.locals.AOPSInfo = AOPSInfoObj;
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    res.locals.validationError = req.flash('validationError'); // for update account info page
    res.locals.user = req.user;
    res.locals.url = req.url;
    res.locals.path = require('path');
    res.locals.validators = validators;
    res.locals.striptags = striptags;

    next();
});


// data models
const {Notice, AOPS, Member} = require('./models');

// database
mongoose
    .connect( 'mongodb://localhost:27017/AOPS', {useNewUrlParser: true, useFindAndModify:false} )
    .then( con => console.log('Connected to database!') )
    .catch( err => console.log('Error connecting to database!') );

// seed database
const seed = require('./db-seed');
if (process.env.DB_SEED === "TRUE") seed();

// import routes
const { noticeRoute, dashboardRoute, baseRoute, memberRoute, achievementRoute, eventRoute, galleryRoute } = require('./routes');

// register routes
app.use('/', baseRoute);
app.use('/notice', noticeRoute);
app.use('/dashboard', dashboardRoute);
app.use('/member', memberRoute);
app.use('/event', eventRoute);
app.use('/achievement', achievementRoute);
app.use('/gallery', galleryRoute);


app.listen( 3000, () => console.log('Server has started!') );