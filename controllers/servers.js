/**
 * Servers controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var controller = require('./controller.js'),
    Server = require('../models/server.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

/**
 * Retrieves servers
 */
module.exports.getServers = function (req, res){
    Server.find({}, controller.wrapup(res));
};

/**
 * Create server
 */
module.exports.createServer = function (req, res){
    var server = req.body;
    //TODO do some check
    Server.save(server, controller.wrapup(res));
};

/**
 * Update server
 */
module.exports.updateServer = function (req, res){
    var server = req.body;
    //TODO do some check
    Server.save(server, controller.wrapup(res));
};

/**
 * Delete server
 */
module.exports.deleteServer = function (req, res){
    var _id = req.params._id;
    //TODO do some check
    Server.remove({ _id: _id}, controller.wrapup(res));
};


