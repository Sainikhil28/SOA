// src/components/LoadTestDashboard.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const LoadTestDashboard = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [apiLogs, setApiLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Function to log API activity
  const logApi = (endpoint, status) => {
    const newLog = {
      endpoint,
      status,
      time: new Date().toLocaleTimeString(),
    };
    setApiLogs((prev) => [newLog, ...prev]);
  };

  // Fetch current load test details
  const fetchLoadTestStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/loadtest/status");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setActiveUsers(data.activeUsers);

      // Push to chart data
      setChartData((prev) => [
        ...prev.slice(-9), // keep last 10 points
        { time: new Date().toLocaleTimeString(), users: data.activeUsers },
      ]);

      logApi("/api/loadtest/status", "✅ success");
    } catch (err) {
      setLoadError(err.message);
      logApi("/api/loadtest/status", "❌ failed");
    }
  };

  // Auto refresh every 5s
  useEffect(() => {
    fetchLoadTestStatus();
    const interval = setInterval(fetchLoadTestStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Load Test Dashboard</h2>

      {/* Active Users Card */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow border-primary">
            <div className="card-body text-center">
              <h4 className="card-title">Active Users</h4>
              <h2 className="text-primary">{activeUsers}</h2>
              <p className="text-muted">Max allowed: 15</p>
              {loadError && (
                <div className="alert alert-danger">{loadError}</div>
              )}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="col-md-6">
          <div className="card shadow border-success">
            <div className="card-body">
              <h5 className="text-center mb-3">Active Users Trend</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#0d6efd" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* API Logs Table */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="mb-3">API Activity Logs</h5>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Time</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apiLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.time}</td>
                    <td>{log.endpoint}</td>
                    <td
                      className={
                        log.status.includes("✅")
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {log.status}
                    </td>
                  </tr>
                ))}
                {apiLogs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No API activity yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadTestDashboard;
