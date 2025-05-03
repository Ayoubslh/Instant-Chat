const Notification = require('../models/notificationModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');


exports.getOne = async (req, res, next) => {
  try {
    console.log("okk");
    const data = await Notification.findById(req.params.id);
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
    const data = await Notification.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};



exports.createNotif = async (req, res, next) => {
  try {
    const data = await Notification.create(req.body);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(new AppError(err.msg, 400));
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const data = await Notification.findByIdAndUpdate(req.params.id, { isRead: req.body.isRead }, {
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
    const data = await Notification.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "fail", error: 'Not found' });
    }
    res.status(200).json({ status: "success", data: null });
  } catch (err) {
    next(new AppError(err.msg, 400));
  }
}

exports.deleteAll = async (req, res, next) => {
  console.log(req.user._id);
  await Notification.deleteMany({ user: req.user._id });
  res.status(200).json({ status: "success", data: null });
}

