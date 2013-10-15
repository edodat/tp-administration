/**
 * Agents controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var controller = require('./controller.js'),
    Agent = require('../models/agent.js'),
    Company = require('../models/company.js'),
    bus = require('./bus.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

/**
* Listener called when an API agent requests information.
 */
module.exports.onAgentDiscover = function(message) {
    // Update or Insert
    Agent.update({ host: message.host }, { host: message.host, companies: [] }, { upsert: true });

    Company.find({ 'agent.host': message.host }, function(err, companies){
        for(var i in companies){
            bus.publishAgent(message.host, companies[i].key);
        }
    });
};

/**
 * Listener called when an API agent sends info for a company.
 */
module.exports.onAgentCompany = function(message) {
    Agent.updateCompanyStatus(message.host, message.company, message.status, message.port);
};

/**
 * Listener called when an API agent shuts down.
 */
module.exports.onAgentShutdown = function(message) {
    Agent.remove({ host: message.host });
};

/**
 * Retrieves agents
 */
module.exports.getAgents = function (req, res){
    Agent.find({}, controller.wrapup(res));
};

/**
 * Shutdown agent
 */
module.exports.shutdownAgent = function (req, res){
    var _id = req.params._id;
    Agent.findById(_id, function(err, agent){
        if (err) return controller.error(res, err);

        bus.publishShutdown(agent);

        return controller.success(res, null);
    });
};
