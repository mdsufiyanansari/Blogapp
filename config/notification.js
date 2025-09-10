const axios = require("axios");

const sendNotification = async (message, userIds = []) => {
  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_player_ids: userIds,  // kis user ko bhejna hai
        contents: { en: message },
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
        },
      }
    );

    console.log("✅ Notification sent:", response.data);
  } catch (error) {
    console.error("❌ Error sending notification:", error.response?.data || error.message);
  }
};

module.exports = sendNotification;
