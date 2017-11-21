const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  const placeShema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    slug: {
      type: String,
      unique: true
    },
    description: String
  });

  // middleware -----
  // make sure that the slug is created from the name
  placeShema.pre('save', function(next) {
    this.slug = utis.slugify(this.name);
    next();
  });

  // create the model
  const placeModel = mongoose.model('Place', placeShema);

  // export the model
  module.exports = placeModel;
