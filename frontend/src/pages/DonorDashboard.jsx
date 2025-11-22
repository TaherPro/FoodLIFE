import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    unit: "items",
    location: "",
    category: "other",
  });

  const API_URL = "http://localhost:5007/api/donations";

  // Load donations for the logged-in donor
  const fetchMyDonations = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // Filter donations for this donor only
      const mine = data.filter((d) => d.donor === user.id || d.donor?._id === user.id);

      setDonations(mine);
    } catch (err) {
      console.error(err);
      alert("Failed to load donations");
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // Add the new donation to UI
      setDonations([data, ...donations]);

      // Clear the form
      setForm({
        itemName: "",
        quantity: "",
        unit: "items",
        location: "",
        category: "other",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create donation");
    }
  };

  return (
    <div>
      <h1>Donor Dashboard</h1>

      {/* Create Donation Form */}
      <div className="card">
        <h2>Create a Donation</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="itemName"
            placeholder="Item name"
            value={form.itemName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <input
            name="unit"
            placeholder="Unit (kg, cans, boxes)"
            value={form.unit}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Pickup Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="dry">Dry</option>
            <option value="fresh">Fresh</option>
            <option value="canned">Canned</option>
            <option value="other">Other</option>
          </select>

          <button type="submit">Create Donation</button>
        </form>
      </div>

      {/* Display Donor Donations */}
      <div>
        <h2>My Donations</h2>

        {donations.length === 0 && <p>No donations yet.</p>}

        {donations.map((d) => (
          <div className="card" key={d._id}>
            <h3>{d.itemName}</h3>
            <p>
              <strong>Quantity:</strong> {d.quantity} {d.unit}
            </p>
            <p>
              <strong>Category:</strong> {d.category}
            </p>
            <p>
              <strong>Location:</strong> {d.location}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    d.status === "approved"
                      ? "green"
                      : d.status === "pending"
                      ? "orange"
                      : d.status === "reserved"
                      ? "blue"
                      : d.status === "completed"
                      ? "gray"
                      : "red",
                }}
              >
                {d.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
