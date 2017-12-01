const utils = require("../utils/utils.js")
const place = require("./place.js")
const dateFormat = require('dateformat')
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
  date: Date,
  description: String
});

// create the model
const registryModel = mongoose.model('Registry', registrySchema);

// export the model
module.exports = registryModel;
