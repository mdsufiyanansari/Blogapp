const express = require("express");
const postModel = require("../models/post");
const userModel = require("../models/user");
const isLoggedIn = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Post
router.post("/post", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    const post = await postModel.create({ user: user._id, content: req.body.content });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// Like/Unlike
router.get("/like/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    const index = post.likes.indexOf(req.user.userid);

    if (index === -1) post.likes.push(req.user.userid);
    else post.likes.splice(index, 1);

    await post.save();
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// Edit Post
router.get("/edit/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user");
    res.render("edit", { post });
  } catch (err) {
    next(err);
  }
});

// Update Post
router.post("/update/:id", isLoggedIn, async (req, res, next) => {
  try {
    await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
