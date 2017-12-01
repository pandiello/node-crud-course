const Place = require('../models/place');
const Registry = require('../models/registry');

module.exports = {
  showPlaces: showPlaces,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
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
      Registry.Find({ place: place.id }, (err, registries) => {
        place.Registry = registries;
      });
    });

    res.render('pages/Place/places', {
      places: places,
      sucess: req.flash('sucess')
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

    res.render('pages/Place/singlePlace', {
      place: place,
      success: req.flash('success')
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
    req.flash('success', 'Successfuly created event!');

    // redirect to the newly created event
    res.redirect(`/places/${place.id}`);
  });
};
