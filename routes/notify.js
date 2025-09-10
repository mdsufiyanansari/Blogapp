const express = require("express");
const sendNotification = require("../config/notification");
const router = express.Router();

router.post("/notify", async (req, res) => {
  const { message, userIds } = req.body; // frontend se bhejna hoga
  await sendNotification(message, userIds);
  res.json({ success: true, message: "Notification sent!" });
});

module.exports = router;
