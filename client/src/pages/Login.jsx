import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "harsh@devhub.com", password: "password123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#F8FAFC] px-6">
      <div className="bg-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px] w-full max-w-md p-8 border border-[#334155]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#4F7CFF] to-[#38BDF8] text-white flex items-center justify-center text-2xl font-black mx-auto mb-3 shadow-lg shadow-[#4F7CFF]/30">
            D
          </div>
          <h1 className="text-3xl font-black text-[#F8FAFC]">Welcome Back</h1>
          <p className="text-[#94A3B8] text-xs mt-1 font-medium">
            Login to your DevHub developer workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full devhub-input p-3 text-sm"
            />
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full devhub-input p-3 text-sm"
            />
          </div>

          {error && <p className="text-[#EF4444] text-xs font-semibold bg-[#EF4444]/15 p-3 rounded-[12px] border border-[#EF4444]/30">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[12px] font-bold shadow-lg shadow-[#4F7CFF]/25 mt-2"
          >
            {loading ? "Logging in..." : "Login to DevHub"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-[#111827] rounded-[16px] text-xs text-[#CBD5E1] border border-[#334155]">
          <p className="font-bold text-[#38BDF8] mb-0.5">💡 Demo Credentials:</p>
          <p>Email: <span className="font-mono font-semibold text-[#F8FAFC]">harsh@devhub.com</span></p>
          <p>Password: <span className="font-mono font-semibold text-[#F8FAFC]">password123</span></p>
        </div>

        <p className="text-center mt-6 text-xs text-[#94A3B8]">
          Don't have an account?
          <Link to="/register" className="text-[#38BDF8] font-bold ml-1 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
