
const express = require("express");
const paymentRouter = express.Router();
const {userAuth} = require("../middlewares/userAuth");
const instance = require("../utils/razorpay");
const Payment = require("../model/payment");
const {User} = require('../model/user');
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature,} = require("razorpay/dist/utils/razorpay-utils");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.userProfile;

    const order = await instance.orders.create({
      "amount": membershipAmount[membershipType] * 100,
      "currency": "INR",
      "receipt": "receipt#1",
      "notes": {
        firstName,
        lastName,
        emailId,
        "membershipType": membershipType
      }
    });

    // Save it in  database
    const payment = new Payment({
      userId: req.userProfile._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // Return back my order details to frontend
    res.json({message:"order is created successfully" , data:{...savedPayment.toJSON() , keyId: process.env.RAZORPAY_KEY_ID }});
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// this api is called by razorpay by post method and  body and X-Razorpay-Signature is send in headers;
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    
    const webhookSignature = req.get("X-Razorpay-Signature"); // this is send in header part
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.error("Invalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;//send by razorpay
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();


    // Update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay else it will keep calling api again and again
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/payment/verify", userAuth, async (req, res) => {
  const user = req.userProfile.toJSON();

  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

module.exports = paymentRouter;
