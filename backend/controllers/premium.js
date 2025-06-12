import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpayUtils.js";

// Controller to create a Razorpay order for premium
export const createPremiumOrder = async (req, res) => {
  const { id } = req.params;
  // fetch premium details from Premium Model later on
  const amount = 500.00; // Example amount in INR
  const currency = "INR";
  const order = await createRazorpayOrder(amount, currency, "order_rcptid_11");
  res.json({
    success: true,
    message: "Order created successfully",
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
};

// Controller to verify Razorpay payment for premium
export const verifyPremiumPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const { id } = req.params;

  const isValid = verifyRazorpayPayment(
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    process.env.RAZORPAY_KEY_SECRET
  );

  console.log("Is valid : ", isValid);

  if (isValid) {
    // TODO: Update user's premium status in database
    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
