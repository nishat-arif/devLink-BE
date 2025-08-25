const Razorpay = require("razorpay");


//create a instance or intialize or instantiate you razorPay  with the secret keys in your backend application to connect and 
//communicate with  it

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;