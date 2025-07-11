import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpayUtils.js";

export const createPremiumOrder = async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  let amount;
  let receiptId;

  switch (plan) {
    case "basic":
      amount = 19900;  // ₹199 in paise
      receiptId = "order_basic_" + id;
      break;
    case "standard":
      amount = 50000; // ₹500 in paise
      receiptId = "order_standard_" + id;
      break;
    case "pro":
      amount = 99900; // ₹999 in paise
      receiptId = "order_pro_" + id;
      break;
    default:
      return res.status(400).json({ success: false, message: "Invalid plan" });
  }

  const currency = "INR";

  try {
    const order = await createRazorpayOrder(amount, currency, receiptId);

    res.json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Controller to verify Razorpay payment for premium
export const verifyPremiumPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;


  const isValid = verifyRazorpayPayment(
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    process.env.RAZORPAY_KEY_SECRET
  );


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
