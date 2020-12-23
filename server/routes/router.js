const express = require("express");
const authRouter = require("./authRouter");

const router = express.Router();
/**
 * @desc : Route for Auth
 * @route :Post  /api/auth
 */

router.use("/auth", authRouter);
// router.use("/profile", profileRouter);
// router.use("/book", bookRouter);

module.exports = router;
