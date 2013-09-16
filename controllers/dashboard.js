/**
 * Administration dashboard controller
 *
 * User: Etienne
 * Date: 16/09/13
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
var DashboardController = {};

module.exports = DashboardController;

/**
 *
 */
DashboardController.render = function (req, res){
    res.render('dashboard');
};


