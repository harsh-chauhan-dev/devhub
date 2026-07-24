import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
// import register from "../services";
import Button from "../components/common/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
   confirmPassword: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //     const handlSubmit = async (e) => {
  //       alert("successfuly register.")
  //     e.preventDefault();
  //     (setLoading(true), setError(""));
  //     try {
  //     //   const res = await register(formData);
  //     //   if (res.status === 200) {
  //     //     navigate("/login");
  //     //   }
  //     } catch (error) {
  //       setError(error.response?.data?.message || "Login failed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
     if (formData.password !== formData.confirmPassword) {
  setError("Passwords do not match");
  return;
}
alert("Registration Successful!");
navigate("/login");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    console.log(formData);

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>

        <p className="text-center text-gray-500 mt-2">Join DevHub today</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

         <Button type="submit">
  {loading ? "Signing up..." : "Sign Up"}
</Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <Link to="/login" className="text-indigo-600 ml-2">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
