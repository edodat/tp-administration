/**
 * Agent model class
 *
 * User: Etienne
 * Date: 17/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var model = require('./model.js');

model.declare(module.exports, 'agents');

/**
 * Drop agents collection on startup.
 * Running agents will be freshly discovered through the service bus.
 */
module.exports._collection.drop();

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

/**
 * Updates agent status for one company.
 * @param host
 * @param companyKey
 * @param status
 * @param port
 */
module.exports.updateCompanyStatus = function (host, companyKey, status, port){
    module.exports.update({ host: host }, { $pull: { 'companies': { company: companyKey } } }, function(){
        module.exports.update({ host: host }, { $push: { 'companies': { company: companyKey, status: status, port: port } } });
    });
};

/**
 * Returns an agent with available resources to be bound with a new company.
 */
module.exports.selectAgentToBind = function (callback){
    //TODO implement selection algorithm
    // for the moment, return the first one ("natural" order)
    module.exports.findOne({}, callback);
};

