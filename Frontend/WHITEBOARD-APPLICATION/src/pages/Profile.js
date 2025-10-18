import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/auth-context";
import "./Profile.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [error, setError] = useState("");
  const [newCanvasName, setNewCanvasName] = useState("");
  const [status, setStatus] = useState("");
  const [shareInputVisible, setShareInputVisible] = useState(null); // which canvas is being shared
  const [shareEmail, setShareEmail] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const navigate = useNavigate();
  const { token, updateToken } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProfile(data.user);
        else {
          setError(data.message || "Failed to fetch profile");
          navigate("/login");
        }
      } catch {
        setError("Error fetching profile");
        navigate("/login");
      }
    };

    const fetchCanvases = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/canvas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const list = data.canvases || [];
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setCanvases(list);
        } else setError(data.message || "Failed to fetch canvases");
      } catch {
        setError("Error fetching canvases");
      }
    };

    fetchProfile();
    fetchCanvases();
  }, [navigate, token]);

  const handleLogout = () => {
    updateToken(null);
    navigate("/login");
  };

  const handleCreateCanvas = async () => {
    if (!newCanvasName.trim()) {
      setStatus("Please enter a canvas name.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/canvas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCanvasName }),
      });
      const data = await res.json();
      if (res.ok) {
        setCanvases((prev) => [data.canvas, ...prev]);
        setStatus(`Canvas "${data.canvas.name}" created successfully!`);
        setNewCanvasName("");
      } else setStatus(data.message || "Failed to create canvas");
    } catch {
      setStatus("Error creating canvas");
    }
  };

  const handleDeleteCanvas = async (canvasId) => {
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/canvas/${canvasId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete canvas");
      }
      setCanvases((prev) => prev.filter((c) => c._id !== canvasId));
    } catch (err) {
      alert(err.message || "Error deleting canvas");
    }
  };

  const handleShareCanvas = async (canvasId) => {
    if (!shareEmail.trim()) {
      setShareStatus("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/canvas/share/${canvasId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shareEmail: shareEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setShareStatus(`Canvas shared with ${shareEmail}`);
        setShareInputVisible(null);
        setShareEmail("");
      } else {
        setShareStatus(data.message || "Failed to share canvas");
      }
    } catch {
      setShareStatus("Error sharing canvas");
    }

    setTimeout(() => setShareStatus(""), 3000);
  };

  return (
    <div className="profile-container">
      {profile ? (
        <div className="profile-card">
          <h2>Hello, {profile.name}</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <p className="loading">{error || "Loading profile..."}</p>
      )}

      <div className="canvas-section">
        <h3>Your Canvases</h3>
        <div className="create-canvas">
          <input
            type="text"
            value={newCanvasName}
            onChange={(e) => setNewCanvasName(e.target.value)}
            placeholder="Enter new canvas name"
            className="canvas-input"
          />
          <button onClick={handleCreateCanvas} className="create-btn">
            Create
          </button>
        </div>
        {status && <p className="status">{status}</p>}
        {shareStatus && <p className="status">{shareStatus}</p>}

        {canvases.length > 0 ? (
          <ul className="canvas-list">
            {canvases.map((canvas) => (
              <li
                key={canvas._id}
                className="canvas-item"
                onClick={() => navigate(`/canvas/${canvas._id}`)}
              >
                <h4>{canvas.name}</h4>
                <p>
                  <strong>Owner:</strong> {canvas.owner?.name} <br />
                  <strong>Created:</strong>{" "}
                  {new Date(canvas.createdAt).toLocaleString()} <br />
                  <strong>Last Updated:</strong>{" "}
                  {new Date(canvas.updatedAt).toLocaleString()}
                </p>

                <div className="canvas-actions">
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCanvas(canvas._id);
                    }}
                  >
                    Delete
                  </button>

                  <button
                    className="share-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareInputVisible(
                        shareInputVisible === canvas._id ? null : canvas._id
                      );
                    }}
                  >
                    Share
                  </button>
                </div>

                {shareInputVisible === canvas._id && (
                  <div
                    className="share-box"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter email to share"
                      className="share-input"
                    />
                    <button
                      className="share-confirm-btn"
                      onClick={() => handleShareCanvas(canvas._id)}
                    >
                      Share Canvas
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-canvases">No canvases found.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
