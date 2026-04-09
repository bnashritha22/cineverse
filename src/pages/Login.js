import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } else {
      alert("Invalid login ❌");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">

        <h2 className="text-2xl mb-4 text-center">Login</h2>

        <input
          placeholder="Username"
          className="p-2 text-black mb-3 w-full rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 text-black mb-3 w-full rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="btn w-full">
          Login
        </button>

        <p className="mt-3 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-400">Signup</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;