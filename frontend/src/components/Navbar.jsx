import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo-text">Food<span>LIFE</span></Link>


      {user ? (
        <>
          {user.role === "donor" && <Link to="/donor" style={{ color: "white" }}>My Dashboard</Link>}
          {user.role === "recipient" && <Link to="/recipient" style={{ color: "white" }}>Browse</Link>}
          {user.role === "staff" && <Link to="/staff" style={{ color: "white" }}>Staff Panel</Link>}

          <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white" }}>Login</Link>
          <Link to="/register" style={{ color: "white" }}>Register</Link>
        </>
      )}
    </nav>
  );
}
