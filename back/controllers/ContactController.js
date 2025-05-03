const Contact = require('../models/contactModel');
const AppError = require('../utils/AppError');



exports.getAll = async (req, res, next) => {
  try {
    const data = await Contact.find();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
}


exports.getOne = async (req, res, next) => {
  try {
    const data = await Contact.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "fail", error: 'Not found' });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError("err.msg", 400));
  }
}

exports.getAllForSpecificUser = async (req, res, next) => {
  try {
    const data = await Contact.find({ user: req.params.id }); // fixed
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
}


exports.createContact = async (req, res, next) => {
  try {
    const data = await Contact.create(req.body); // Ideally validate here
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      return res.status(404).json({ status: "fail", error: 'Not found' });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.msg, 400));
  }
}

exports.deleteOne = async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "fail", error: 'Not found' });
    }
    res.status(200).json({ status: "success", data: null });
  } catch (err) {
    next(new AppError(err.message, 400));

  }
}

exports.deleteAll = async (req, res, next) => {
  try {
    console.log(req.params.id);
    await Contact.deleteMany({ user: req.params.id });
    res.status(200).json({ status: "success", data: null });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
}

