import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StaffDashboard() {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  const DONATIONS_URL = "http://localhost:5007/api/donations";
  const REQUESTS_URL = "http://localhost:5007/api/requests";

  // Load all donations
  const fetchDonations = async () => {
    try {
      const res = await fetch(DONATIONS_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setDonations(data);
    } catch (err) {
      console.error(err);
      alert("Error loading donations");
    }
  };

  // Load all requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(REQUESTS_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setRequests(data);
    } catch (err) {
      console.error(err);
      alert("Error loading requests");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchRequests();
  }, []);

  // Approve / Reject donation
  const updateDonationStatus = async (id, status) => {
    try {
      const res = await fetch(`${DONATIONS_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to update donation");
    }
  };

  // Approve / Reject / Picked Up
  const updateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`${REQUESTS_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setRequests(requests.filter((r) => r._id !== id));

      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  // Delete request
  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;

    try {
      const res = await fetch(`${REQUESTS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      setRequests(requests.filter((r) => r._id !== id));

      alert("Request deleted.");
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  // Delete donation by staff
  const deleteDonation = async (id) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;

    try {
      const res = await fetch(`${DONATIONS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete donation");
        return;
      }

      setDonations(donations.filter((d) => d._id !== id));

      alert("Donation deleted successfully.");
    } catch (err) {
      alert("Server Error");
    }
  };

  return (
    <div>
      <h1>Staff Dashboard</h1>

      {/* Donations Section */}
      <h2>Manage Donations</h2>

      {donations.length === 0 ? (
        <p>No donations available.</p>
      ) : (
        donations.map((d) => (
          <div className="card" key={d._id}>
            <h3>{d.itemName}</h3>

            <p><strong>Donor:</strong> {d.donor?.name || "Unknown"}</p>
            <p><strong>Quantity:</strong> {d.quantity} {d.unit}</p>
            <p><strong>Location:</strong> {d.location}</p>
            <p><strong>Status:</strong> {d.status}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              {d.status === "pending" && (
                <>
                  <button onClick={() => updateDonationStatus(d._id, "approved")}>
                    Approve
                  </button>
                  <button onClick={() => updateDonationStatus(d._id, "rejected")}>
                    Reject
                  </button>
                </>
              )}

              {d.status === "approved" && (
                <button disabled>Ready for Requests</button>
              )}

              {d.status === "reserved" && (
                <button disabled>Reserved by Recipient</button>
              )}

              {d.status === "completed" && (
                <button disabled>Completed</button>
              )}

              <button
                onClick={() => deleteDonation(d._id)}
                style={{ background: "#e74c3c" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <hr />

      {/* Requests Section */}
      <h2>Manage Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        requests.map((r) => (
          <div className="card" key={r._id}>
            <h3>{r.donation?.itemName || "Donation Deleted"}</h3>
            <p><strong>Recipient:</strong> {r.recipient?.name}</p>
            <p><strong>Status:</strong> {r.status}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              {r.status === "pending" && (
                <>
                  <button onClick={() => updateRequestStatus(r._id, "approved")}>
                    Approve
                  </button>

                  <button onClick={() => updateRequestStatus(r._id, "rejected")}>
                    Reject
                  </button>
                </>
              )}

              {r.status === "approved" && (
                <>
                  <button onClick={() => updateRequestStatus(r._id, "picked_up")}>
                    Mark as Picked Up
                  </button>

                  <button
                    onClick={() => deleteRequest(r._id)}
                    style={{ background: "#e74c3c" }}
                  >
                    Delete
                  </button>
                </>
              )}

              {r.status === "rejected" && (
                <button
                  onClick={() => deleteRequest(r._id)}
                  style={{ background: "#e74c3c" }}
                >
                  Delete
                </button>
              )}

              {r.status === "picked_up" && (
                <button disabled>Picked Up</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
