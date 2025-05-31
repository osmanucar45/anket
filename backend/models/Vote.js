const mongoose = require('mongoose');
const VoteSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  tshirtColor: String,
  tshirtModel: String,
  pantColor: String
});
module.exports = mongoose.model('Vote', VoteSchema);
