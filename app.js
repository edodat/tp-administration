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
var Model = require('./models/model.js');

///////////////////
// CONFIGURATION //
///////////////////

// Express middleware configuration file
require('./config/express.js')(app, express);

// Converts all incoming "_id" string parameters to MongoDB ObjectIDs
app.param(['_id'], function(req, res, next, _id){
    req.params._id = Model.ObjectId(_id);
    next();
});
app.put('*', function(req, res, next){
    req.body._id = Model.ObjectId(req.body._id);
    next();
});

////////////
// ROUTES //
////////////

app.get('/companies', controllers.companies.getCompanies);
app.post('/companies', controllers.companies.register);
app.put('/companies/:_id', controllers.companies.updateCompany);
app.del('/companies/:_id', controllers.companies.disableCompany);

app.get('/servers', controllers.servers.getServers);
app.post('/servers', controllers.servers.createServer);
app.put('/servers/:_id', controllers.servers.updateServer);
app.del('/servers/:_id', controllers.servers.deleteServer);


//////////////////
// START SERVER //
//////////////////

var server = http.createServer(app);
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});
