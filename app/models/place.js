const mongoose = require('mongoose'),
  utils = require("../utils/utils.js");
  Schema = mongoose.Schema;

  const placeSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
       unique: true
     },
    description: String
  });

  // create the model
  const placeModel = mongoose.model('Place', placeSchema);

  // export the model
  module.exports = placeModel;
