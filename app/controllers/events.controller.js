const Event = require('../models/registry');
const Place = require('../models/place');
const dateFormat = require('dateformat');

module.exports = {
  showEvents: showEvents,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteEvent: deleteEvent
}

/**
 * Show all events
 */
function showEvents(req, res) {
  // get all events
  Event.find({}, (err, events) => {
    if (err) {
      res.status(404);
      res.send('Events not found!');
    }

    // return a view with data
    res.render('pages/Event/events', {
      events: events,
      dateformat: dateFormat,
      success: req.flash('success')
    });
  }).populate('place');
}

/**
 * Show a single event
 */
function showSingle(req, res) {
  Event.findOne({ _id: req.params.id }, (err, event) => {
    if (err) {
      res.status(404);
      res.send('Event not found!');
    }

    if (!event){
        req.flash('error', 'Event not found.');
        return res.redirect('/events');
    }

    res.render('pages/Event/single', {
      event: event,
      success: req.flash('success')
    });
  }).populate('place');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
  Place.find({}, (error, places) => {
    if(error){
      res.status(404);
      res.send('Events not found!');
    };
      res.render('pages/Event/create', {
      places: places,
      errors: req.flash('errors')
    });
  });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required.').notEmpty();
  req.checkBody('placeName', 'Place is required.').notEmpty();
  req.checkBody('date', 'Date is required.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/events/create');
  }

  // Check if the place id really exists on the database
  Place.findOne({ name: req.body.placeName }, (err, place) => {
    if(err || !place){
      req.flash('errors', 'El lugar especificado es invalido.');
      return res.redirect('/events/create');
    }

    // create a new event
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      place: place.id
    });

    // save event
    event.save((err) => {
      if (err){
        req.flash('errors', JSON.stringify(err) + 'Error creando el parte.');
        return res.redirect(`/events/create`);
      }

      // set a successful flash message
      req.flash('success', 'Parte creado correctamente');

      // redirect to the newly created event
      res.redirect(`/events/${event.id}`);
    });
  });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
  Event.findOne({ _id: req.params.id }, (err, event) => {
    Place.find({}, (error, places) => {
      res.render('pages/Event/edit', {
        event: event,
        places: places,
        dateFormat: dateFormat,
        errors: req.flash('errors')
      });
    });
  }).populate('place');
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required.').notEmpty();
  req.checkBody('placeName', 'Place is required.').notEmpty();
  req.checkBody('date', 'Date is required.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/events/${req.params.id}/edit`);
  }

  // finding a current event
  Event.findOne({ _id: req.params.id }, (err, event) => {

    // Check if the place id really exists on the database
    Place.findOne({ name: req.body.placeName }, (err, place) => {
      if(err || !place){
        req.flash('errors', 'El lugar especificado es invalido.');
        return res.redirect('/events/create');
      }

        // updating that event
        event.name        = req.body.name;
        event.description = req.body.description;
        event.date        = req.body.date;
        event.place       = place.id

        event.save((err) => {
          if (err){
            req.flash('errors', 'Error updating value. The name must be unique.');
            return res.redirect(`/events/${req.param.id}/edit`);
          }

          // success flash message
          // redirect back to the /events
          req.flash('success', 'Parte actualizado correctamente');
          res.redirect('/events');
        });
    });
  });

}

/**
 * Delete an event
 */
function deleteEvent(req, res) {
  Event.remove({ id: req.params.id }, (err) => {
    // set flash data
    // redirect back to the events page
    req.flash('success', 'Event deleted!');
    res.redirect('/events');
  });
}
