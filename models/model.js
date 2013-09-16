/**
 * Parent model (abstract class)
 *
 * User: Etienne
 * Date: 12/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var mongo = require('mongojs');

/////////////
// PRIVATE //
/////////////

// Connect to database
var db = mongo.connect('localhost/admin');

////////////
// PUBLIC //
////////////

// Static class or singleton (equivalent in Javascript)
var Model = {};

/**
 * Initialization function for Model's subclasses.
 * Augments subclass capabilities by adding static functions.
 *
 * Usage (subclass definition) :
 *      var MyModel = {};
 *      Model.declare(MyModel, 'mycollection');
 *      ... define custom methods...
 *
 * @param Subclass
 * @param collectionName : Mongo collection where subclass objects are stored
 */
Model.declare = function (Subclass, collectionName){
    // create _collection variable in subclass
    var collection = Model._db.collection(collectionName);
    Subclass._collection  = collection;
    // augment subclass with MongoJS functions
    Subclass.findById = Model.findById;
    Subclass.find = Model.find;
    Subclass.findOne = Model.findOne;
    Subclass.findAndModify = Model.findAndModify;
    Subclass.update = Model.update;
    Subclass.save = Model.save;
    Subclass.remove = Model.remove;
};

/**
 * DB connection handler.
 */
Model._db = db;

/**
 * Static functions mapped to MongoJS collection functions.
 * These functions are made available to Model's subclasses by "Model.declare" function above.
 */

Model.find = function (){
    this._collection.find.apply(this._collection, arguments);
};

Model.findOne = function () {
    this._collection.findOne.apply(this._collection, arguments);
};

Model.findById = function (id, callback) {
    this._collection.findOne({ _id: Model.ObjectId(id) }, callback);
};

Model.findAndModify = function () {
    this._collection.findAndModify.apply(this._collection, arguments);
};

Model.update = function () {
    this._collection.update.apply(this._collection, arguments);
};

Model.save = function () {
    this._collection.save.apply(this._collection, arguments);
};

Model.remove = function () {
    this._collection.remove.apply(this._collection, arguments);
};

/**
 * Utility function to convert String id to ObjectId.
 *
 * @param id (string or ObjectId)
 * @returns ObjectId
 */
Model.ObjectId = function (id){
    if (typeof id == 'string') return Model._db.ObjectId(id);
    else return id;
};


module.exports = Model;