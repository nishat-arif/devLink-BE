const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequest = require("../model/connectionRequest");

// This job will run at 12:20 pm in the morning everyday
cron.schedule("20 12 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);


    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];



    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await sendEmail.run(
          "New Friend Requests are pending for " + email,
          "There are so many friend reuests pending, please login to devlink.com and accept or reject the requests."
        );

      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});