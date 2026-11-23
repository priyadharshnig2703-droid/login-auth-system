
import { useState } from "react";
import "./App.css";

function App() {
  
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [isSuccess, setIsSuccess] = useState(false);
const [token, setToken] = useState("");
const handleGetProfile = async () => {
  try {
    const response = await fetch(
      "http://localhost:5002/api/auth/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log(data);

  } catch (error) {
    console.log("Profile error:", error);
  }
};
const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const response = await fetch(
      "http://localhost:5002/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
  setIsSuccess(true);
  setMessage(data.message);
   setToken(data.token);
} else {
  setIsSuccess(false);
  setMessage(data.message || "Login failed");
} 

  } catch (error) {
  console.log("Login error:", error);
  setIsSuccess(false);
  setMessage("Unable to connect to the server. Please try again.");
}
};
  return (
  <div className="login-container">
<div className="login-card">
<h3>Hey there, <br/></h3>
 <h1>Welcome back</h1>
<p>Let's LogIn</p>
<form onSubmit={handleLogin}>
  <div className="form-group">
  <label>Email</label>
  <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
</div>
 <div className="form-group">
  <label>Password</label>
<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
/>
  </div>
<button type="submit">Login </button>
{token && (
  <button type="button" onClick={handleGetProfile}>
    View Profile
  </button>
)}
{message && (
  <p className={isSuccess ? "success-message" : "error-message"}>
    {message}
  </p>
)}
</form>
</div>
</div>
);
}

export default App;
