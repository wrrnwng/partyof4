var utils = require('../config/utils');

module.exports = {
  getNearbyEvents: function(){
    /* Select all events from events table where distance
       between user and events < some number. */
  },

  createEvent: function(req, res){
    var models = req.app.get('models');
    var Event = models.Event;

    /* The newEvent object contains a number of properties -- some obtained
       from the body of the request and some defaults. This object is used
       to build the Sequelize model that will be saved in the database. */
    var newEvent = {};
    newEvent.HostId = req.body.HostId;
    newEvent.locationId = req.body.locationId;
    newEvent.plannedTime = req.body.plannedTime;
    newEvent.capacity = req.body.capacity;
    newEvent.currentSize = req.body.currentSize;
    newEvent.currentActivity = req.body.currentActivity;
    newEvent.completedStatus = false;

    /* Builds a Sequelize model based on newEvent object and saves to the database. 
       Sends a response if this is successful. Otherwise, logs an error. */
    Event.sync().then(function () {
      return Event.create(newEvent);
    }).then (function (newEvent) {
      utils.sendResponse(res, 201, newEvent);
    }).catch(function (err) {
      console.log('Error: ', err);
    });
  },

  getEvent: function(req, res){
    var models = req.app.get('models');
    var Event = models.Event;
    var eventId = req.params.eventId;

    Event.sync().then(function () {
      return Event.findById(eventId);
    }).then(function (event) {
      utils.sendResponse(res, 200, event);
    }).catch(function (err) {
      console.log('Error: ', err);
    });
  },

  updateEvent: function (req, res) {
    var models = req.app.get('models');
    var Event = models.Event;
    var eventId = req.params.eventId;

    var updatedEvent = {};
    updatedEvent.HostId = req.body.HostId;
    updatedEvent.locationId = req.body.locationId;
    updatedEvent.plannedTime = req.body.plannedTime;
    updatedEvent.capacity = req.body.capacity;
    updatedEvent.currentSize = req.body.currentSize;
    updatedEvent.currentActivity = req.body.currentActivity;
    updatedEvent.completedStatus = req.body.completedStatus;

    var options = {};
    options.where = { id: eventId };
    options.returning = true;

    Event.sync().then(function () {
      return Event.update(updatedEvent, options);
    }).then(function (update) {
      /* Sequelize update method returns an array. Second element is an 
         array contained updated records. We want the first updated record 
         since there should be only one. See documentation of .update() at: 
         http://docs.sequelizejs.com/en/latest/api/model/#updatevalues-options-promisearrayaffectedcount-affectedrows */
      updatedEvent = update[1][0];
      utils.sendResponse(res, 200, updatedEvent);
    }).catch(function (err) {
      console.log('Error: ', err);
    });
  },

  getHistory: function(req, res){
    var models = req.app.get('models');
    var Event = models.Event;
    var userId = req.params.userId;

    Event.sync().then(function () {
      return Event.findAll({ where: { HostId : userId }});
    }).then(function (events){
      utils.sendResponse(res, 200, events);
    }).catch(function (err){
      console.log('Error: ', err);
    });
  },

};