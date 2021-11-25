const Beleske = require("../model/Beleske");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const schedule = require("node-schedule");
const sendEmail = require("../utils/sendEmail");

// @desc    Pregled svih beleski od korisnika
// @route   GET /api/beleske
// access   Private
exports.getBeleske = asyncHandler(async (req, res, next) => {
  const beleske = await Beleske.find({ user: req.user.id });

  res.status(200).json({ success: true, count: beleske.length, data: beleske });
});

// @desc    Pregled jedne beleske od korisnika
// @route   GET /api/beleske/:id
// access   Private
exports.getBelesku = asyncHandler(async (req, res, next) => {
  const beleska = await Beleske.findById(req.params.id);

  if (!beleska) {
    return next(
      new ErrorResponse(`Note not found with the id of ${req.params.id}`, 404)
    );
  }
  console.log(beleska.title);

  if (beleska.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to view this note`,
        401
      )
    );
  }

  res.status(200).json({ success: true, data: beleska });
});

// @desc    Napravi jednu blesku
// @route   POST /api/beleske/
// access   Private
exports.createBeleske = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const beleska = await Beleske.create(req.body);

  const options = {
    email: req.user.email,
    subject: req.body.title,
    message: req.body.content,
  };

  const job = schedule.scheduleJob(
    beleska._id.toString(),
    req.body.remindAt,
    function () {
      sendEmail(options);
    }
  );

  res.status(201).json({
    success: true,
    data: beleska,
  });
});

// @desc    Izmeni jednu blesku
// @route   PUT /api/beleske/:id
// access   Private
exports.updateBeleske = asyncHandler(async (req, res, next) => {
  let beleska = await Beleske.findById(req.params.id);

  if (!beleska) {
    return next(
      new ErrorResponse(`Note not found with the id of ${req.params.id}`, 404)
    );
  }

  if (beleska.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this note`,
        401
      )
    );
  }

  beleska = await Beleske.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const options = {
    email: req.user.email,
    subject: beleska.title,
    message: beleska.content,
  };

  try {
    if (req.body.remindAt) {
      const cancelJob = schedule.scheduledJobs[req.params.id];
      cancelJob.cancel();

      const job = schedule.scheduleJob(
        req.params.id,
        req.body.remindAt,
        function () {
          sendEmail(options);
        }
      );
    }
  } catch (error) {
    console.log("Message was already sent");
  }

  res.status(200).json({ success: true, data: beleska });
});

// @desc    Obrisi jednu blesku
// @route   DELETE /api/beleske/:id
// access   Private
exports.deleteBeleske = asyncHandler(async (req, res, next) => {
  const beleska = await Beleske.findById(req.params.id);

  if (!beleska) {
    return next(
      new ErrorResponse(`Note not found with the id of ${req.params.id}`, 404)
    );
  }

  if (beleska.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this note`,
        401
      )
    );
  }

  const cancelJob = schedule.scheduledJobs[req.params.id];
  cancelJob.cancel();

  beleska.remove();
  res.status(200).json({ success: true, data: {} });
});
