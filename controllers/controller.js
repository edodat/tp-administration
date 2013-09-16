/**
 * Parent controller
 *
 * User: Etienne
 * Date: 10/09/13
 * Time: 15:36
 */

////////////////////
// INITIALIZATION //
////////////////////

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var Controller = {};
module.exports = Controller;

/**
 * Handles success response
 *
 * @param res : HTTP response
 * @param obj : object to return
 */
Controller.success = function (res, obj) {
    res.type('json');
    res.json(obj);
};

/**
 * Handles technical error response
 *
 * @param res : HTTP response
 * @param message : error message
 */
Controller.error = function (res, message) {
    res.type('json');
    res.json(500, { error: message });
};

/**
 * Handles access error response
 *
 * @param res : HTTP response
 * @param message : error message
 */
Controller.unauthorized = function (res, message) {
    res.type('json');
    res.json(401, { error: message });
};

/**
 * Handles resource error response
 *
 * @param res : HTTP response
 * @param message : error message
 */
Controller.notFound = function (res, message) {
    res.type('json');
    res.json(404, { error: message });
};

