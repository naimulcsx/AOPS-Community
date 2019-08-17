const cookieParser = require( 'cookie-parser' ),
      session      = require( 'express-session' )
      flash        = require( 'connect-flash' ),
      mongoose     = require( 'mongoose' ),
      express      = require( 'express' ),
      morgan       = require( 'morgan' ),
      app          = express();

// middlewares
app.use( morgan('dev') );
app.use( express.json() );
app.set( 'view engine', 'pug' );
app.use( express.static( 'public' ) );
app.locals.moment = require('moment');
app.use( cookieParser('secret') );
app.use( session({
    cookie: { maxAge: 60000 },
    secret: 'Hello world',
    resave: true,
    saveUninitialized: true
}) );

app.use( flash() );


// data models
const {Notice, AOPS} = require('./models');

// database
mongoose
    .connect( 'mongodb://localhost:27017/AOPS', {useNewUrlParser: true} )
    .then( con => console.log('Connected to database!') )
    .catch( err => console.log('Error connecting to database!') );


// seed database
const seed = require('./db-seed');


// routes
const noticeRoute = require('./routes/notice');
const dashboardRoute = require('./routes/dashboard');
const baseRoute = require('./routes/base');

app.use('/', baseRoute);
app.use('/notice', noticeRoute);
app.use('/dashboard', dashboardRoute);



app.listen( 3000, () => console.log('Server has started!') );