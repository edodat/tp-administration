/**
 * Registration controller
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
var RegistrationController = {};

module.exports = RegistrationController;

/**
 *
 */
RegistrationController.register = function (req, res) {
    var companyKey = req.body.companyKey;

    var companyName = req.body.companyName;
    var companySize = req.body.companySize;
    var companyContactPhone = req.body.companyPhone;
    var companyContactEmail = req.body.companyEmail;

    var companyAddressLine1 = req.body.companyAddressLine1;
    var companyAddressLine2 = req.body.companyAddressLine2;
    var companyAddressZipCode = req.body.companyAddressZipCode;
    var companyAddressCity = req.body.companyAddressCity;
    var companyAddressState = req.body.companyAddressState;
    var companyAddressCountry = req.body.companyAddressCountry;

    var adminUsername = req.body.adminUsername;
    var adminPassword = req.body.adminPassword;
    var adminEmail = req.body.adminEmail;
    var isAdmin = true;

    if (!companyKey) return Controller.error(res, 'Missing company key');
    if (!companyContactEmail) return Controller.error(res, 'Missing company contact email address');
    if (!adminUsername || !adminPassword || !adminEmail) return Controller.error(res, 'Missing administrator account details');

    // check for unicity
    Company.findOne({ key: companyKey }, function(err, duplicateCompany){
        if (err) return Controller.error(res, 'Technical error');

        if (duplicateCompany) {
            return Controller.error(res, 'Company key already in use');
        }

        var company = {
            key: companyKey,
            details : {
                name: companyName,
                size: companySize,
                contact : {
                    email: companyContactEmail,
                    phone: companyContactPhone,
                    address: {
                        line1: companyAddressLine1,
                        line2: companyAddressLine2,
                        zipcode: companyAddressZipCode,
                        city: companyAddressCity,
                        state: companyAddressState,
                        country:companyAddressCountry
                    }
                }
            }
        };

        // Save company to database
        Company.save(company, function(err){
            if (err) return Controller.error(res, 'Technical error');

            return Controller.success(res, { company: company });
        });

    });

};
