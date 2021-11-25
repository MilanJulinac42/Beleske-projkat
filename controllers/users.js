const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Beleske = require("../model/Beleske");
const schedule = require("node-schedule");

// @desc    Podaci o trenutnom korisniku
// @route   GET /api/auth/register
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc    Izmena podataka korisnika
// @route   PUT /api/auth/register
// @access  Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const { name, email, password, repeatPassword } = req.body;

  if (password != repeatPassword) {
    return next(new ErrorResponse("Passwords must match", 400));
  }

  const fieldsToUpdate = {
    name,
    email,
    password,
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    fieldsToUpdate
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Brisanje korisnika
// @route   DELETE /api/auth/register
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const beleske = await Beleske.find({ user: req.user.id });

  for (obj in beleske) {
    const cancelJob = schedule.scheduledJobs[beleske[obj]._id.toString()];
    cancelJob.cancel();
  }

  user.remove();
  res.status(200).json({ success: true, data: {} });
});
