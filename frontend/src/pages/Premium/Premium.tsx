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
  const [activePlan, setActivePlan] = useState<"basic" | "standard" | "pro" | null>(null);


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

const handlePayment = async (plan: "basic" | "standard" | "pro") => {
  try {
    setActivePlan(plan);

    const res = await post(
      `${import.meta.env.VITE_SERVER_URL}/api/premium/:id/buy`,
      { plan }
    );

    if (!res.success) {
      toast.error("Failed to create order");
      return;
    }

    const { amount, currency, orderId } = res;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id: orderId,
      name: "ArogyaPath Premium",
      description: `Purchase of ${plan} plan`,
      handler: (response: any) => {
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
        color: "#16a34a",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
    });

    rzp.open();
  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error("Could not initiate payment. Please try again.");
    setActivePlan(null);
  } finally{
    setIsLoading(false);
    setActivePlan(null)
  }
};


return (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gray-50">
    <div className="text-center mb-10">
      <h2 className="text-4xl font-bold text-gray-800">Choose Your Premium Plan</h2>
      <p className="mt-2 text-gray-600 text-sm">
        Flexible options to match your wellness journey
      </p>
    </div>

    {/* Pricing Cards Container */}
    <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
      {/* Basic Plan */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-green-400 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
        <h3 className="text-xl font-semibold text-green-600">Basic</h3>
        <p className="mt-1 text-gray-500 text-sm">Starter health guidance & resources</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>✓ Weekly health tips</li>
          <li>✓ Basic diet plans</li>
          <li>✓ Limited expert access</li>
        </ul>
        <div className="mt-6 text-2xl font-bold text-gray-800">₹199</div>
        <button
          onClick={() => handlePayment("basic")}
          disabled={isLoading || activePlan === "basic"}
          className="mt-4 w-full py-2 px-4 text-white bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {activePlan === "basic" ? "Processing..." : "Choose Basic"}
        </button>
      </div>

      {/* Standard Plan */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-green-600 hover:shadow-xl hover:border-green-700 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
        <h3 className="text-xl font-semibold text-green-700">Standard</h3>
        <p className="mt-1 text-gray-500 text-sm">Most popular for health enthusiasts</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>✓ Personalized plans</li>
          <li>✓ Chat with Ayurvedic experts</li>
          <li>✓ Exclusive articles & tips</li>
        </ul>
        <div className="mt-6 text-2xl font-bold text-gray-800">₹500</div>
        <button
          onClick={() => handlePayment("standard")}
          disabled={isLoading || activePlan === "standard"}
          className="mt-4 w-full py-2 px-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {activePlan === "standard" ? "Processing..." : "Choose Standard"}
        </button>
      </div>

      {/* Pro Plan */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-green-400 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
        <h3 className="text-xl font-semibold text-green-600">Pro</h3>
        <p className="mt-1 text-gray-500 text-sm">For serious wellness seekers</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>✓ All Standard benefits</li>
          <li>✓ One-on-one expert calls</li>
          <li>✓ Health report analysis</li>
          <li>✓ Priority support</li>
        </ul>
        <div className="mt-6 text-2xl font-bold text-gray-800">₹999</div>
        <button
          onClick={() => handlePayment("pro")}
          disabled={ isLoading || activePlan === "pro"}
          className="mt-4 w-full py-2 px-4 text-white bg-green-700 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          {activePlan === "pro" ? "Processing..." : "Choose Pro"}
        </button>
      </div>
    </div>
  </div>
);

};

export default Premium;
