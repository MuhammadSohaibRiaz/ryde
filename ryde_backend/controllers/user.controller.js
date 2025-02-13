const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/blackListToken.model");
const otpController = require("../controllers/otp.controller");
const { randomString } = require("../utils/randomString");
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, phoneNo, password } = req.body;

  const isUserAlready = await userModel.findOne({ email });

  if (isUserAlready) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname,
    email,
    phoneNo,
    password: hashedPassword,
  });

  const otp = randomString();
  const to = email;
  otpController.sendOtp(to, otp);

  //save otp to db
  user.otp.code = otp;
  await user.save();

  res.status(201).json({ user, otp });
};

module.exports.verifyUser = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel
    .findOne({
      email,
    })
    .select("+otp.code");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp.code !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  //update user otp to verified
  user.otp.verified = true;
  await user.save();

  const token = user.generateAuthToken();
  res.cookie("token", token);

  return res.status(200).json({ token, user });
};

module.exports.set2FA = async (req, res, next) => {
  try {
    const userId = req.user._id ?? req.body.userId;
    const status = req.body.status;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Unmatched fields error" });
    }

    // set twofactor status
    user.twoFactor = status ? true : false;
    await user.save();

    res.status(200).json({
      message: "2FA setup status changed to " + status,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.requestOtp = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    let user = null;
    if (userId) user = await userModel.findById(userId);
    else {
      user = await userModel.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ message: "Unmatched fields error" });
    }

    const otp = randomString();
    const to = user.email;
    otpController.sendOtp(to, otp);

    //save otp to db
    user.otp.code = otp;
    await user.save();

    res.status(200).json({
      message: "otp successfully sent to your email",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.otp.verified) {
    return res.status(401).json({
      message: "Please verify your account first or request for new otp",
    });
  }

  if (!user.twoFactor) {
    const token = user.generateAuthToken();
    res.cookie("token", token);
    return res.status(200).json({
      token,
      user,
    });
  }

  user.otp.verified = false;
  const otp = randomString();
  user.otp.code = otp;
  await user.save();

  res.status(200).json({
    token,
    user: {
      ...user,
      otp: {
        verified: false,
        code: null,
      },
    },
  });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  //   await blackListTokenModel.create({ token });

  return res.status(200).json({ message: "Logged out" });
};

module.exports.uploadImage = async (req, res, next) => {
  try {
    const userId = req.user._id ?? req.body.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const imagePath = `/upload/${req.file.filename}`;

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        {
          image: imagePath,
        },
        { new: true }
      )
      .select("-password");

    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email, phone } = req.body;

    // Create update object with only provided fields
    const updateData = {};
    if (email) updateData.email = email;
    if (phone) updateData.phoneNo = phone;

    const user = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User information updated successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = randomString();
    const hashedPassword = await userModel.hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    otpController.sendOtp(email, newPassword);

    res.status(200).json({
      message: "New password has been sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.addEmergencyContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contact } = req.body;

    // Validate contact input
    if (!contact || typeof contact !== "string") {
      return res.status(400).json({
        message: "Contact is required and must be a string",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $push: { emergencyContacts: contact } },
        { new: true }
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Emergency contact added successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.deleteEmergencyContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contact } = req.body;

    // Validate contact input
    if (!contact || typeof contact !== "string") {
      return res.status(400).json({
        message: "Contact is required and must be a string",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { emergencyContacts: contact } },
        { new: true }
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Emergency contact deleted successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
