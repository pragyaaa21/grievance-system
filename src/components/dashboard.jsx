import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic"
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get("/grievances");
      setGrievances(res.data);
    } catch {
      alert("Unauthorized, please login again");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/grievances", form);
    setForm({ title: "", description: "", category: "Academic" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await API.delete(`/grievances/${id}`);
    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <button className="logout" onClick={logout}>Logout</button>

      <h3>Add Grievance</h3>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Title" 
          value={form.title}
          onChange={(e)=>setForm({...form, title:e.target.value})}
        />
        <input 
          placeholder="Description" 
          value={form.description}
          onChange={(e)=>setForm({...form, description:e.target.value})}
        />
        <select 
          value={form.category}
          onChange={(e)=>setForm({...form, category:e.target.value})}
        >
          <option>Academic</option>
          <option>Hostel</option>
          <option>Transport</option>
          <option>Other</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <h3>All Grievances</h3>
      {grievances.map((g) => (
        <div className="card" key={g._id}>
          <p><b>{g.title}</b> - {g.category}</p>
          <p>{g.description}</p>
          <button onClick={() => handleDelete(g._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;