/**
 * Companies controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var controller = require('./controller.js'),
    Company = require('../models/company.js'),
    Agent = require('../models/agent.js'),
    bus = require('./bus.js');

/////////////
// PRIVATE //
/////////////

/**
 * Binds an API agent to a company.
 */
function bind (company, callback) {
    // Select agent to bind
    Agent.selectAgentToBind(function(err, agent){
        if (err) callback(err);
        if (!agent) return callback(new Error('No running agent to bind'));
        // attach agent to company
        Company.update({ key: company.key }, { $set: { agent: { host: agent.host } } });
        // publish to bus
        bus.publishAgent(agent.host, company.key);
        callback(null, company);
    });
}

////////////
// PUBLIC //
////////////

/**
 * Retrieves companies
 */
module.exports.getCompanies = function (req, res){
    Company.find({}).sort({ key: 1 }, controller.wrapup(res));
};

/**
 * Creates new company account
 */
module.exports.register = function (req, res) {
    var company = req.body;

    if (!company.key) return controller.error(res, new Error('Missing company key'));
    if (!company.details.contact.email) return controller.error(res, new Error('Missing company contact email address'));

    // check for unicity
    Company.findOne({ key: company.key }, function(err, duplicateCompany){
        if (err) return controller.error(res, err);

        if (duplicateCompany) {
            return controller.error(res, new Error('Company key already in use'));
        }

        // Save company to database
        Company.save(company, function(err, company){
            if (err) return controller.error(res, err);

            // Publish registration to bus
            bus.publishRegistered(company);

            // Bind an API agent to the company
            bind(company, controller.wrapup(res));
        });
    });
};

/**
 * Binds an API agent to a company.
 */
module.exports.bindCompanyAgent = function (req, res){
    var _id = req.params._id;
    Company.findById(_id, function(err, company){
        if (err) return controller.error(res, err);
        bind(company, controller.wrapup(res));
    });
};

/**
 * Runs company agent
 */
module.exports.runCompanyAgent = function (req, res){
    var _id = req.params._id;
    Company.findById(_id, function(err, company){
        if (err) return controller.error(res, err);
        if (!company.agent) return controller.error(res, new Error('Company not bound to an agent'));

        Agent.findOne({ host: company.agent.host }, function(err, agent){
            if (err) return controller.error(res, err);
            if (!agent) return controller.error(res, new Error('Agent is shutdown'));

            bus.publishRun(company, agent);
            return controller.success(res, agent);
        });
    });
};

/**
 * Standby company agent
 */
module.exports.standbyCompanyAgent = function (req, res){
    var _id = req.params._id;
    Company.findById(_id, function(err, company){
        if (err) return controller.error(res, err);
        if (!company.agent) return controller.error(res, new Error('Company not bound to an agent'));

        Agent.findOne({ host: company.agent.host }, function(err, agent){
            if (!agent) return controller.error(res, new Error('Agent is shutdown'));
            if (err) return controller.error(res, err);

            bus.publishStandby(company, agent);
            return controller.success(res, agent);
        });
    });
};

/**
 * Update company
 */
module.exports.updateCompany = function (req, res){
    var company = req.body;
    //TODO do some check
    Company.save(company, controller.wrapup(res));
};

/**
 * Disable company
 */
module.exports.disableCompany = function (req, res){
    var _id = req.params._id;
    //TODO do some check
    //TODO proper desactivation
    Company.update({ _id: _id}, { $set: { disabled: true } }, controller.wrapup(res));
};

