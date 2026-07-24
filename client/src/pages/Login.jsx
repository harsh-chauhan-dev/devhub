import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
// import login from "../services";
import Button from "../components/common/Button";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await login(formData);
//       console.log(res.data);
//       if (res.status === 200) {
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
    //     }
    
 
  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  setTimeout(() => {
    if (
      formData.email === "test@gmail.com" &&
      formData.password === "123456"
    ) {
      alert("Login Successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  }, 1000);
};
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your DevHub account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Logging in... " : "Login"}
                  </Button>
                  
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?
          <Link to="/register" className="text-indigo-600 ml-2">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
