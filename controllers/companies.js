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
    bus = require('./bus.js'),
    mail = require('./mail.js'),
    uuid = require('node-uuid').v4;

/////////////
// PRIVATE //
/////////////

var ACTIVATION_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

/**
 * Binds an APP agent to a company.
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
        callback(null, agent);
    });
}

/**
 * Creates activation link and sends activation email
 */
function sendActivation(company, callback){
    var tokenValue = uuid();
    var issueDate = new Date(),
        expirationDate = new Date(issueDate.getTime() + ACTIVATION_TOKEN_EXPIRATION_TIME);
    var token = { token: tokenValue, issueDate: issueDate, expirationDate: expirationDate };

    Company.update({ key: company.key }, { $set: { activation: token } }, function(err){
        if(err) return callback(new Error('Technical error before sending activation email'));

        //TODO configurable links
        var activationLink = 'https://'+company.key+'.app.lean-project.com/#/activate/'+token.token;
        // send mail
        mail.sendActivation(company.details.contact.email, activationLink, function(err){
            if(err) return callback(new Error('Technical error while sending activation email'));
            console.log('[ADMIN] Activation email sent for company', company.key);
            return callback(null, { ok: true });
        });
    });
}

/**
 * Creates new company account
 */
function register (company, callback) {
    if (!company.key) return callback(new Error('Missing instance name'));
    if (!company.details.contact.email) return callback(new Error('Missing email address'));

    // check for unicity
    Company.findOne({ key: company.key }, function(err, duplicateCompany){
        if (err) return callback(err);

        if (duplicateCompany) {
            return callback(new Error('Instance name already in use'));
        }

        // Save company to database
        Company.save(company, function(err, company){
            if (err) return callback(err);

            // Publish registration to bus
            bus.publishRegistered(company);

            // Bind an APP agent to the company
            bind(company, function(err){
                //TODO how to handle this error ?
                if (err) console.log('Binding error for company', company.key, ':', err);
            });

            // Send activation email
            sendActivation(company, callback);
        });
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
 * Binds an APP agent to a company.
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
 * Checks availability of a company key.
 */
module.exports.checkKey = function(req, res) {
    var key = req.body.key;
    // check for unicity
    Company.findOne({ key: key }, function(err, company){
        var available = true;
        if (company) available = false;
        return controller.success(res, { available: available });
    });
};

/**
 * Creates new company account
 */
module.exports.register = function (req, res) {
    var company = req.body;
    console.dir(company);
    register(company, controller.wrapup(res));
};

/**
 * Resends activation email with a fresh activation token.
 * Note: it invalidates any previous activation link sent before.
 */
module.exports.sendActivationEmail = function (req, res){
    var _id = req.params._id;
    Company.findById(_id, function(err, company){
        if (err) return controller.error(res, err);
        if (company.active) return controller.error(res, new Error('Company account is already active'));
        // Send activation email
        sendActivation(company, controller.wrapup(res));
    });
};

/**
 * Resends activation email with a fresh activation token (web service)
 * Note: it invalidates any previous activation link sent before.
 */
module.exports.sendActivationEmailWS = function (req, res){
    var companyKey = req.body.company;
    Company.findOne({ key: companyKey }, function(err, company){
        if (err) return controller.error(res, err);
        if (company.active) return controller.error(res, new Error('Company account is already active'));
        // Send activation email
        sendActivation(company, controller.wrapup(res));
    });
};

/**
 * Activates company account (web service)
 */
module.exports.activateWS = function (req, res) {
    var companyKey = req.body.company;
    var token = req.body.token;
    Company.findOne({ key: companyKey }, function(err, company){
        if (err) return controller.error(res, err);

        // check company status
        if (company.active) return controller.error(res, new Error('Company account is already active'));

        // check activation token
        var now = new Date();
        if (!company.activation || company.activation.token != token || company.activation.expirationDate < now) {
            return controller.error(res, new Error('Invalid activation token'));
        }

        Company.update({ key: companyKey }, { $unset: { activation: 1 }, $set: { active: true } });

        return controller.success(res, { email: company.details.contact.email });
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

