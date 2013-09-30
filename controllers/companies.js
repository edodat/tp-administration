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
    Company = require('../models/company.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var CompaniesController = {};

module.exports = CompaniesController;

/**
 * Retrieves companies
 */
CompaniesController.getCompanies = function (req, res){
    Company.find({}).sort({ key: 1 }, Controller.wrapup(res));
};

/**
 *
 */
CompaniesController.register = function (req, res) {
    var company = req.body;

    if (!company.key) return Controller.error(res, new Error('Missing company key'));
    if (!company.details.contact.email) return Controller.error(res, new Error('Missing company contact email address'));

    // check for unicity
    Company.findOne({ key: company.key }, function(err, duplicateCompany){
        if (err) return Controller.error(res, err);

        if (duplicateCompany) {
            return Controller.error(res, new Error('Company key already in use'));
        }

        // Save company to database
        Company.save(company, Controller.wrapup(res));

    });

};

/**
 * Update company
 */
CompaniesController.updateCompany = function (req, res){
    var company = req.body;
    //TODO do some check
    Company.save(company, Controller.wrapup(res));
};

/**
 * Disable company
 */
CompaniesController.disableCompany = function (req, res){
    var _id = req.params._id;
    //TODO do some check
    //TODO proper desactivation
    Company.update({ _id: _id}, { $set: { disabled: true } }, Controller.wrapup(res));
};

