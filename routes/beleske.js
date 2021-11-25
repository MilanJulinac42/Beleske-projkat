const express = require("express");
const {
  getBeleske,
  getBelesku,
  createBeleske,
  updateBeleske,
  deleteBeleske,
} = require("../controllers/beleske");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getBeleske).post(protect, createBeleske);

router
  .route("/:id")
  .get(protect, getBelesku)
  .put(protect, updateBeleske)
  .delete(protect, deleteBeleske);

module.exports = router;
