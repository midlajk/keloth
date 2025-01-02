
const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String },
    message: { type: String, required: true },
  });
  
  const FormData = mongoose.model('c', formDataSchema);
  module.exports = FormData;
