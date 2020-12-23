const express = require("express");
const jwt = require("jsonwebtoken");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const User = require("../models/User");

const {
  authRegister,
  authLogin,
  authLogout,
  authCurrentUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @access : Public
 * @desc : Register endpoint
 * @route :Post  /api/auth/register
 */

router.post("/register", authRegister);
/**
 * @access : Private
 * @desc : Login endpoint
 * @route :Post  /api/auth/login
 */
router.post("/login", authLogin);

/**
 * @access : Private
 * @desc : Login endpoint
 * @route :Post  /api/auth/logout
 */
router.get("/logout", getAccessToRoute, authLogout);

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get("/user", getAccessToRoute, authCurrentUser);

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = await req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
