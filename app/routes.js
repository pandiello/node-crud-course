// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  eventsController = require('./controllers/events.controller'),
  placesController = require('./controllers/place.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);

// event routes
router.get('/events',       eventsController.showEvents);

// create events
router.get('/events/create',  eventsController.showCreate);
router.post('/events/create', eventsController.processCreate);

// edit events
router.get('/events/:id/edit', eventsController.showEdit);
router.post('/events/:id',     eventsController.processEdit);

// delete events
router.get('/events/:id/delete', eventsController.deleteEvent);

// show a single event
router.get('/events/:id', eventsController.showSingle);

router.get('/places',   placesController.showPlaces)

router.get('/places/create', placesController.showCreate);
router.post('/places/create', placesController.processCreate);
router.get('/places/:id', placesController.showSingle);
router.get('/places/:id/edit', placesController.showEdit);
router.post('/places/:id',     placesController.processEdit);
