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

var bus = require('./controllers/bus.js');

var controllers = require('./controllers');
var model = require('./models/model.js');

///////////////////
// CONFIGURATION //
///////////////////

// Express middleware configuration file
require('./config/express.js')(app, express);

// Converts all incoming "_id" string parameters to MongoDB ObjectIDs
app.param(['_id'], function(req, res, next, _id){
    req.params._id = model.ObjectId(_id);
    next();
});
app.put('*', function(req, res, next){
    req.body._id = model.ObjectId(req.body._id);
    next();
});

/////////
// API //
/////////

app.get('/companies', controllers.companies.getCompanies);
app.post('/companies', controllers.companies.register);
app.put('/companies/:_id', controllers.companies.updateCompany);
app.del('/companies/:_id', controllers.companies.disableCompany);
app.post('/companies/:_id/bind', controllers.companies.bindCompanyAgent);
app.post('/companies/:_id/run', controllers.companies.runCompanyAgent);
app.post('/companies/:_id/standby', controllers.companies.standbyCompanyAgent);
app.post('/companies/:_id/sendactivationemail', controllers.companies.sendActivationEmail);

app.get('/agents', controllers.agents.getAgents);
app.post('/agents/:_id/shutdown', controllers.agents.shutdownAgent);


////////
// WS //
////////

app.post('/ws/checkkey', controllers.companies.checkKey);
app.post('/ws/register', controllers.companies.register);

app.post('/ws/sendactivationemail', controllers.companies.sendActivationEmailWS);
app.post('/ws/activate', controllers.companies.activateWS);

///////////////////////////
// SERVICE BUS LISTENERS //
///////////////////////////

bus.initialize(function(){

    bus.on('agent.discover', controllers.agents.onAgentDiscover);
    bus.on('agent.company', controllers.agents.onAgentCompany);
    bus.on('agent.shutdown', controllers.agents.onAgentShutdown);

    bus.discover();
});


//////////////////
// START SERVER //
//////////////////

var server = http.createServer(app);
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});
