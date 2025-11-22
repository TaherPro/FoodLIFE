import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  const DONATIONS_URL = "http://localhost:5007/api/donations";
  const REQUESTS_URL = "http://localhost:5007/api/requests";


  const fetchDonations = async () => {
    try {
      const res = await fetch(DONATIONS_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      const approved = data.filter((d) => d.status === "approved");
      setDonations(approved);
    } catch (err) {
      console.error(err);
      alert("Failed to load donations");
    }
  };

  // Load recipient's requests
  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${REQUESTS_URL}/mine`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setRequests(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your requests");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchMyRequests();
  }, []);

  // Request a donation
  const requestItem = async (donationId) => {
    try {
      const res = await fetch(REQUESTS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("Request submitted!");

      fetchMyRequests(); 
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  return (
    <div>
      <h1>Recipient Dashboard</h1>

      {/* Approved donations list */}
      <h2>Available Donations</h2>

      {donations.length === 0 && <p>No approved donations available.</p>}

      {donations.map((d) => (
        <div className="card" key={d._id}>
          <h3>{d.itemName}</h3>
          <p><strong>Quantity:</strong> {d.quantity} {d.unit}</p>
          <p><strong>Category:</strong> {d.category}</p>
          <p><strong>Location:</strong> {d.location}</p>

          <button onClick={() => requestItem(d._id)}>
            Request This Item
          </button>
        </div>
      ))}

      <hr />

      {/* Recipient's requests */}
      <h2>My Requests</h2>

      {requests.length === 0 && <p>You have no requests.</p>}

      {requests.map((req) => (
        <div className="card" key={req._id}>
          <h3>{req.donation?.itemName}</h3>
          <p><strong>Status:</strong> 
            <span style={{
              color:
                req.status === "approved" ? "green" :
                req.status === "pending" ? "orange" :
                req.status === "rejected" ? "red" :
                req.status === "picked_up" ? "gray" :
                "black"
            }}>
              {req.status}
            </span>
          </p>

          <p><strong>Location:</strong> {req.donation?.location}</p>
          <p><strong>Requested On:</strong> {new Date(req.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
