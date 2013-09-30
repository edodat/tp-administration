/**
 * Administration dashboard controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var Controller = require('./controller.js'),
    Server = require('../models/server.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var ServersController = {};

module.exports = ServersController;

/**
 * Retrieves servers
 */
ServersController.getServers = function (req, res){
    Server.find({}, Controller.wrapup(res));
};

/**
 * Create server
 */
ServersController.createServer = function (req, res){
    var server = req.body;
    //TODO do some check
    Server.save(server, Controller.wrapup(res));
};

/**
 * Update server
 */
ServersController.updateServer = function (req, res){
    var server = req.body;
    //TODO do some check
    Server.save(server, Controller.wrapup(res));
};

/**
 * Delete server
 */
ServersController.deleteServer = function (req, res){
    var _id = req.params._id;
    //TODO do some check
    Server.remove({ _id: _id}, Controller.wrapup(res));
};


