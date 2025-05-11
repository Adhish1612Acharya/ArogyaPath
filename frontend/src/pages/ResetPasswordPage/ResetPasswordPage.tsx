import useApi from "@/hooks/useApi/useApi";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ResetPasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { post } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match");

    try {
      //   const res = await axios.post(`/api/auth/reset-password/${token}`, {
      //     password,
      //   });
      const res = await post(`/api/auth/reset-password/${token}`, password);
      if (res.status === 200) {
        navigate("/login");
      } else {
        setMessage(res.data.error || "Something went wrong");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
