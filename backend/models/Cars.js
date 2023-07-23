// {
//     "title": "bmw",
//     "model": "X5",
//     "year": "2022",
//     "color": "black"
// }

const { Schema, model } = require('mongoose');

const carsSchema = new Schema({
  title: {
    type: String,
    required: [true, 'db: title is required'],
  },
  model: {
    type: String,
    default: 'anonim',
  },
  year: {
    type: Number,
    required: [true, 'db: year is required'],
  },
  color: {
    type: String,
    default: 'anonim',
  },
});

module.exports = model('cars', carsSchema);
