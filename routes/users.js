const express = require("express");
const {
  updateUserDetails,
  getMe,
  deleteUser,
} = require("../controllers/users");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/updateuserdetails", protect, updateUserDetails);
router.delete("/deleteuser", protect, deleteUser);

module.exports = router;
