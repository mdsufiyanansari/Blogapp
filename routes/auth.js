const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const router = express.Router();

// Register page
router.get("/", (req, res) => res.render("index"));

// Login page
router.get("/login", (req, res) => res.render("login"));

// Register user
router.post("/register", async (req, res, next) => {
  try {
    const { username, name, age, email, password } = req.body;

    let existing = await userModel.findOne({ email });
    if (existing) return res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username, name, age, email, password: hash,
    });

    const token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.redirect("/login");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.redirect("/login");

    const token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
