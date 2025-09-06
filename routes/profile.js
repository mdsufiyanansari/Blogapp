const express = require("express");
const postModel = require("../models/post");
const userModel = require("../models/user");
const isLoggedIn = require("../middlewares/authMiddleware");
const upload = require("../config/multerconfig");

const router = express.Router();


// ✅ Profile Page (GET)
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("posts"); // user ke saath uske posts bhi aayenge

    res.render("profile", { user });
  } catch (err) {
    next(err);
  }
});


// Upload Page
router.get("/profile/upload", isLoggedIn, (req, res) => {
  res.render("profileupload");
});

// Upload Image
router.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

// Create Post
router.post("/post", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    const post = await postModel.create({
      user: user._id,
      content: req.body.content,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// Like/Unlike Post
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
    await postModel.findByIdAndUpdate(req.params.id, {
      content: req.body.content,
    });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
