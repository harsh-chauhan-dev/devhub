import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    githubUsername: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        githubUsername: formData.githubUsername,
        password: formData.password,
      });
      // Route immediately to verify-email page passing the email address
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#F8FAFC] px-6">
      <div className="bg-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px] w-full max-w-md p-8 border border-[#334155]">
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Dev<span className="text-[#38BDF8]">Hub</span>
          </span>
          <h1 className="text-xl font-bold text-[#F8FAFC] mt-3">Create Account</h1>
          <p className="text-[#94A3B8] text-xs mt-1 font-medium">Join DevHub developer workspace</p>
        </div>

        {successMsg ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <p className="text-sm font-medium text-emerald-300">{successMsg}</p>
            <p className="text-xs text-[#94A3B8]">
              Please check your email inbox and click the verification link before signing in.
            </p>
            <Button onClick={() => navigate("/login")} className="w-full py-3 rounded-[12px] font-bold mt-4">
              Go to Login Page
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full devhub-input p-3 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full devhub-input p-3 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">GitHub Profile URL or Username</label>
              <input
                type="text"
                name="githubUsername"
                value={formData.githubUsername}
                onChange={handleChange}
                placeholder="e.g. https://github.com/octocat or octocat"
                required
                className="w-full devhub-input p-3 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                className="w-full devhub-input p-3 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-xs text-[#CBD5E1]">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
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
              {loading ? "Signing up..." : "Sign Up & Get Started"}
            </Button>
          </form>
        )}

        <p className="text-center mt-6 text-xs text-[#94A3B8]">
          Already have an account?
          <Link to="/login" className="text-[#38BDF8] font-bold ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
