const Place = require('../models/place');
const Registry = require('../models/registry');
const dateformat = require('dateformat');

module.exports = {
  showPlaces: showPlaces,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
}

/**
* Show all place
*/
function showPlaces(req, res){
  Place.find({}, (err, places) => {
    if (err) {
      res.status(404);
      res.send('Event not found!');
    }

    places.forEach(place => {
      Registry.find({ place: place.id }, (err, registries) => {
        if(err){
          req.flash('error', err);
        }

        place.regiestries = registries;
      });
    });

    res.render('pages/Place/places', {
      places: places,
      success: req.flash('success')
    });
  });
}

/**
 * Show a single place
 */
function showSingle(req, res) {
  // get a single event
  Place.findOne({ _id: req.params.id }, (err, place) => {
    if (err) {
      res.status(404);
      res.send('Event not found!');
    }

    Registry.find({ place: place.id }, (err, registries) => {
        if(err){
          req.flash('error', err);
        };
        place.registries = registries;
        res.render('pages/Place/singlePlace', {
          place: place,
          dateformat: dateformat,
          success: req.flash('success')
      });
    });
  });
};

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render('pages/Place/createPlace', {
    errors: req.flash('errors')
  });
};

function processCreate(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/places/create');
  }

  // create a new event
  const place = new Place({
    name: req.body.name,
    description: req.body.description
  });

  // save event
  place.save((err) => {
    if (err){
      req.flash('errors', JSON.stringify(err) + '. Error creando el parte.');
      return res.redirect(`/places/create`);
    }

    // set a successful flash message
    req.flash('success', 'Cruce creado correctamente!');

    // redirect to the newly created event
    res.redirect(`/places/${place.id}`);
  });
};

/**
 * Show the edit form
 */
function showEdit(req, res) {
  Place.findOne({ _id: req.params.id }, (err, place) => {
      res.render('pages/Place/editPlace', {
        place: place,
        errors: req.flash('errors')
      });
  });
};

function processEdit(req, res){
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    Place.findOne({ _id: req.params.id }, (err, place) => {
      if(err){
        req.flash('error', 'Error, place not found');
        res.redirect(`places/${req.params.id}/edit`);
      }

      place.name = req.body.name;
      place.description = req.body.description;

      place.save((err) => {
        if (err){
          req.flash('errors', 'Error updating value.');
          return res.redirect(`/places/${req.param.id}/edit`);
        }

        // success flash message
        // redirect back to the /events
        req.flash('success', 'Cruce actualizado correctamente.');
        res.redirect('/places');

    });
  });
};
