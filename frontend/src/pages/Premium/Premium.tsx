import useApi from "@/hooks/useApi/useApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
}

const Premium = () => {
  const { post } = useApi();
  const [userProfile, _setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const verifyPayment = async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/premium/:id/payment-confirm`,
        paymentData
      );
      if (response.success) {
        toast.success("Payment successful! You are now a premium member.");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      // Create order
      const res = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/premium/:id/buy`,
        {}
      );

      if (!res.success) {
        throw new Error("Failed to create order");
      }

      const order = res;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use public key from Vite env
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "ArogyaPath Premium",
        description: "Premium Membership Access",
        handler: function (response: any) {
          verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: userProfile.fullName,
          email: userProfile.email,
          contact: userProfile.phone,
        },
        theme: {
          color: "#16a34a", // Green color matching your theme
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (_response: any) {
        toast.error("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Upgrade to Premium
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get access to exclusive features and personalized health guidance
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Premium Benefits</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>✓ Personalized health recommendations</li>
                <li>✓ Direct chat with Ayurvedic experts</li>
                <li>✓ Exclusive content and resources</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">₹500</p>
              <p className="text-sm text-gray-600">One-time payment</p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Upgrade Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
