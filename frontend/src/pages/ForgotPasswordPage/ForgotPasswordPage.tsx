import { useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";

export function ForgotPasswordPage() {
  const { role } = useParams<{
    role: "user" | "expert";
  }>();
  const { post } = useApi();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`,
        { email, role }
      );
      console.log(res);
      if (res.success) {
        toast.success("Reset link sent to your email.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
