require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");
const notifyRoutes = require("./routes/notify");

const app = express();

// DB connect
connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api", notifyRoutes);

// Routes
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", postRoutes);

// ✅ OneSignal SDK worker files serve from root
app.get("/OneSignalSDKWorker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "OneSignalSDKWorker.js"));
});

app.get("/OneSignalSDKUpdaterWorker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "OneSignalSDKUpdaterWorker.js"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
