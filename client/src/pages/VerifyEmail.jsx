import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import Button from "../components/common/Button";
import { CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight, X, Sparkles } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(!!token);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [emailInput, setEmailInput] = useState(emailParam || "");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [showFloatingToast, setShowFloatingToast] = useState(true);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      if (emailParam) {
        setMessage(`Verification email has been sent to ${emailParam}. Please check your inbox and verify your account.`);
      } else {
        setMessage("Please check your email inbox for the verification link.");
      }
      return;
    }

    const performVerification = async () => {
      try {
        const res = await authService.verifyEmail(token);
        setSuccess(true);
        setMessage(res.message || "Email verified successfully!");
      } catch (err) {
        setSuccess(false);
        setMessage(err.message || "Email verification failed or token expired.");
      } finally {
        setVerifying(false);
      }
    };

    performVerification();
  }, [token, emailParam]);

  const handleResend = async (e) => {
    e.preventDefault();
    const targetEmail = emailInput.trim() || emailParam;
    if (!targetEmail) return;

    setResending(true);
    setResendMsg("");
    try {
      const res = await authService.resendVerification(targetEmail);
      setResendMsg(res.message || "Verification email dispatched!");
    } catch (err) {
      setResendMsg(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] text-[#F8FAFC] px-6 relative overflow-hidden">
      {/* Dynamic Floating Toast Message Notification */}
      {showFloatingToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-11/12 bg-[#1E293B]/95 backdrop-blur-xl border border-[#38BDF8]/40 shadow-[0_20px_50px_rgba(56,189,248,0.25)] rounded-[20px] p-4 flex items-center gap-4 transition-all transform duration-300 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#38BDF8] flex items-center justify-center shrink-0 shadow-md">
            <Mail size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-[#38BDF8] flex items-center gap-1">
              <Sparkles size={13} /> Check Your Email Inbox!
            </p>
            <p className="text-[11px] text-[#CBD5E1] mt-0.5 leading-snug">
              A verification link was sent to {emailParam ? <strong className="text-white">{emailParam}</strong> : "your email"}. Please check your inbox and verify your email.
            </p>
          </div>
          <button
            onClick={() => setShowFloatingToast(false)}
            className="text-[#94A3B8] hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px] w-full max-w-md p-8 border border-[#334155] text-center relative z-10 mt-12">
        <span className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Dev<span className="text-[#38BDF8]">Hub</span>
        </span>
        <h1 className="text-xl font-bold text-[#F8FAFC] mt-4">Account Email Verification</h1>

        {verifying ? (
          <div className="py-8">
            <RefreshCw size={36} className="animate-spin text-[#38BDF8] mx-auto mb-4" />
            <p className="text-sm text-[#94A3B8]">Verifying your email token...</p>
          </div>
        ) : success ? (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-sm font-medium text-emerald-300">{message}</p>
            <Button onClick={() => navigate("/login")} className="w-full py-3.5 rounded-[12px] font-bold mt-4 flex items-center justify-center gap-2">
              Proceed to Login <ArrowRight size={16} />
            </Button>
          </div>
        ) : !token && emailParam ? (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 bg-[#38BDF8]/20 text-[#38BDF8] rounded-full flex items-center justify-center mx-auto ring-4 ring-[#38BDF8]/10 animate-bounce">
              <Mail size={28} />
            </div>
            <p className="text-sm font-semibold text-[#F8FAFC]">Verification Email Dispatched!</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              We have sent an email verification link to <strong className="text-[#38BDF8]">{emailParam}</strong>.<br />
              Please open your email app, check your inbox, and click the link to verify.
            </p>

            <form onSubmit={handleResend} className="mt-4 text-left space-y-3">
              {resendMsg && <p className="text-xs text-[#38BDF8] text-center font-medium">{resendMsg}</p>}
              <Button type="submit" disabled={resending} className="w-full py-3 rounded-[12px] font-bold text-xs bg-[#334155] hover:bg-[#475569] text-[#F8FAFC]">
                {resending ? "Resending..." : "Resend Verification Email"}
              </Button>
            </form>

            <Button onClick={() => navigate("/login")} className="w-full py-3 rounded-[12px] font-bold mt-2 text-xs">
              Go to Login Page
            </Button>
          </div>
        ) : (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <p className="text-xs text-rose-300 font-medium">{message}</p>

            <form onSubmit={handleResend} className="mt-6 text-left space-y-3">
              <label className="block text-xs font-bold text-[#CBD5E1]">Request Verification Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full devhub-input p-3 text-sm"
              />
              {resendMsg && <p className="text-xs text-[#38BDF8] mt-1">{resendMsg}</p>}
              <Button type="submit" disabled={resending} className="w-full py-3 rounded-[12px] font-bold">
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </form>

            <p className="text-xs text-[#94A3B8] mt-4">
              Already verified? <Link to="/login" className="text-[#38BDF8] font-bold hover:underline">Log In</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyEmail;
