const utils = require("../utils/utils.js")
const place = require("./place.js")
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
const registrySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  name: String,
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
  description: String
});

// middleware -----
// make sure that the slug is created from the name
registrySchema.pre('save', function(next) {
  this.slug = utils.slugify(this.name);
  next();
});

// create the model
const registryModel = mongoose.model('Registry', registrySchema);

// export the model
module.exports = registryModel;
