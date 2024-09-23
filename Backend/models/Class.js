 const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedule: { type: String, required: true }, // E.g., Mon, Wed, Fri 9-10am
});

module.exports = mongoose.model('Class', classSchema);
