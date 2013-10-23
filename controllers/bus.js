/**
 * Service bus controller
 *
 * User: Etienne
 * Date: 01/10/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var amqp = require('amqp'),
    config = require('../config/amqp.js');

/////////////
// PRIVATE //
/////////////

var connection;
var adminExchange;
var queue;
var listeners = {};

/**
 * Initializes bus connection, exchanges and queue.
 * @param callback
 */
function initialize (callback){
    // Connect to bus
    connection = amqp.createConnection({ url: config.connectionURL });
    connection.on('ready', function() {
        console.log('[BUS] Connected to ' + connection.serverProperties.product);

        // declare "administration" AMQP exchange
        adminExchange = connection.exchange('administration', {
            type: 'topic',
            durable: 'true'
        });

        // declare administration queue
        queue = connection.queue('administration', function(q){
            // Receive messages
            q.subscribe(function (message, headers, deliveryInfo) {
                console.log('[BUS] Received', deliveryInfo.routingKey, 'message:', message);
                var cb = listeners[deliveryInfo.routingKey];
                if (cb){
                    cb(message);
                } else {
                    console.log('[BUS] Routing key', deliveryInfo.routingKey, 'not handled. Message discarded.');
                }
            });

            callback(null);
        });
    });
}

/**
 * Publishes a message to the bus.
 * @param routingKey
 * @param message
 */
function publish (routingKey, message){
    console.log('[BUS] Publishing', routingKey, 'message:', message);
    adminExchange.publish(routingKey, message);
}

////////////
// PUBLIC //
////////////

/**
 * Initializes bus connection, exchanges and queue.
 * @param callback
 */
module.exports.initialize = initialize;

/**
 * Closes connection.
 */
module.exports.close = function(){
    connection.end();
};

/**
 * Binds a listener to incoming bus messages.
 * @param routingKey
 * @param callback
 */
module.exports.on = function (routingKey, callback){
    queue.bind(adminExchange, routingKey);
    listeners[routingKey] = callback;
    console.log('[BUS] Listening to', routingKey, 'messages');
}


/**
 * Publishes a message on startup to discover agents (instructs agents to declare themselves)
 */
module.exports.discover = function(){
    publish('admin.discover', {  });
};

/**
 * Publishes a message when a company has registered
 */
module.exports.publishRegistered = function(company){
    publish('admin.registered', { company: company.key });
};

/**
 * Publishes agent details (bound company)
 */
module.exports.publishAgent = function(host, companyKey){
    publish('admin.agent', { host: host, company: companyKey });
};

/**
 * Publishes a message to instruct server to run APP instance
 */
module.exports.publishRun = function(company, agent){
    publish('admin.run', { company: company.key, host: agent.host });
};

/**
 * Publishes a message to instruct server to standby APP instance
 */
module.exports.publishStandby = function(company, agent){
    publish('admin.standby', { company: company.key, host: agent.host });
};

/**
 * Publishes a message to instruct agent to shutdown
 */
module.exports.publishShutdown = function(agent){
    publish('admin.shutdown', { host: agent.host });
};

/**
 * Publishes a message to website with key availability result
 */
module.exports.publishKeyCheckResult = function(key, available){
    publish('admin.key.'+key, { available: available });
};

/**
 * Publishes a message to website with registration result
 */
module.exports.publishRegistrationResult = function(company, ok, err){
    publish('admin.registration.'+company.key, { ok: ok, error: err });
};
