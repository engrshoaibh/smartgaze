 
const Class = require('../models/Class');
const User = require('../models/User');

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { class: newClass }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    const classDetails = await Class.findById(req.params.id)
      .populate('teacher students');
    res.status(200).json({ status: 'success', data: { class: classDetails } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Class not found' });
  }
};
