import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useLocation } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      setIsLogin(true);
    } else if (location.pathname === "/register") {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "auth/login" : "auth/register";

    try {
      const res = await axios.post(endpoint, {
        email,
        password,
      });

      if (isLogin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else if (!isLogin) {
        setIsLogin(true); // switch to login after registration
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message as string);
      console.log(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-[400px] max-w-full mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <span className="flex items-center gap-4">
          <Mail className="w-4 h-4" />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </span>

        <span className="flex items-center gap-4">
          <Lock className="w-4 h-4" />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </span>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
