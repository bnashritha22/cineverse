import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    alert("Signup successful ✅");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">

        <h2 className="text-2xl mb-4 text-center">Signup</h2>

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

        <button onClick={signup} className="btn w-full">
          Signup
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-red-400">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;