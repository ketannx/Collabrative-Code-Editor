const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateUsername,
  updateBio,
} = require("../controller/auth.controller");
const { isAuth } = require("../middleware/isAuthenticated");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", isAuth, getProfile);
router.put("/profile/username", isAuth, updateUsername);  // 👈 separate username update
router.put("/profile/bio", isAuth, updateBio);            // 👈 separate bio update

module.exports = router;
