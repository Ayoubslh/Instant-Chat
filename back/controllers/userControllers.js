const User = require('../models/userModel');
const AppError = require('../utils/AppError');
require('dotenv').config();
//get all users 
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -created_at -updated_at -resetCodeExpiresAt -resetCode -ChangesAt')
    res.status(200).json({
      status: "success",
      data: users
    })
  } catch (err) {
    next(err);
  }
}

//get one user by id 
const getOneById = async (req, res, next) => {
  try {
    const {
      _id,
      fullName,
      address,
      email,
      phoneNumber,
      image,
      role,
      googleId
    } = req.user;
    const userObj = {
      _id,
      fullName,
      address,
      email,
      phoneNumber,
      image,
      role,
      googleId
    }
    res.status(200).json({
      status: "success",
      data: userObj
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

const updateUser = async (req, res) => {
  try {
    if (req.image) {
      req.body.image = req.image
    }
    const { fullName, email, image, address, phone } = req.body;
    const initialObj = { fullName, email, image, address, phone };
    const finalObj = {};
    for (const key in initialObj) {
      if (initialObj.hasOwnProperty(key)) {
        if (initialObj[key]) {
          finalObj[key] = initialObj[key];
        }
      }
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id }, finalObj, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      updatedUser,
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}

const updateUserRole = async (req, res, next) => {
  try {
    const newRole = req.body.role;
    console.log(req.params.id);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true, runValidators: true });
    if (updatedUser === null) throw new AppError('user not found', 404);
    res.status(200).json({
      status: "success",
      data: updatedUser,
    })
  } catch (err) {
    next(err)
  }
}
//fucntion to update user password
const updateUserPassword = async (req, res, next) => {
  try {
    // 1/ get current password confirmNewPassword and new password from the body and get the user from the db
    const { newPassword, confirmNewPassword, currentPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    // 2/ check if currentPassword from the body much the password in the db     // 3/ if no throw an error  
    if (! await user.correctPassword(currentPassword, user.password)) {
      console.log("wrong current password");
      throw new AppError("you entered a wrong password please enter the correct one", 400);
    }
    // 4/ if yes compare the newPassword with the confirmNewPassword if no throw error if yes continue 

    if (!(newPassword === confirmNewPassword)) {
      throw new AppError("make sure new password and confirm password are the same", 400);
    }
    // 5/ updating the user password in the database
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password updated successfuly",
    })
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
    })
  } catch (err) {
    return (new AppError(err.message, 400));
  }
}
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = { getOneById, getAllUsers, updateUser, updateUserRole, updateUserPassword, deleteUser, getUserById };