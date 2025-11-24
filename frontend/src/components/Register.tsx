import React, { useState } from "react";

interface RegisterProps {
  setToken: (token: string) => void;
  setView: (view: "login" | "register") => void;
}

const Register: React.FC<RegisterProps> = ({ setToken, setView }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // After registration, login automatically
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          setToken(loginData.token);
        } else {
          setError(loginData.error);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => setView("login")}>Login</button>
      </p>
    </div>
  );
};

export default Register;
