/**
 * Created with JetBrains WebStorm.
 * User: Etienne
 * Date: 04/09/13
 * Time: 11:56
 */

/**
 * Main application script
 *
 * User: Etienne Dodat
 * Date: 29/08/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var http = require('http'),
    express = require('express'),
    app = express();

var controllers = require('./controllers');

///////////////////
// CONFIGURATION //
///////////////////

// Express middleware configuration file
require('./config/express.js')(app, express);

////////////
// ROUTES //
////////////

// PAGES

app.get('/', controllers.dashboard.render);


// API

app.post('/register', controllers.registration.register);


//////////////////
// START SERVER //
//////////////////

var server = http.createServer(app);
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});
