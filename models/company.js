/**
 * Company model class
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var Model = require('./model.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var Company = {};
module.exports = Company;

Model.declare(Company, 'companies');

