import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils/element";
import { TOOL_ITEMS } from "../constants";

import BoardProvider from "../store/BoardProvider";
import ToolboxProvider from "../store/ToolboxProvider";
import Toolbar from "../components/Toolbar";
import Board from "../components/Board";
import Toolbox from "../components/Toolbox";
import { AuthContext } from "../store/auth-context";
import { connectSocket, disconnectSocket } from "../utils/socket"; // ✅ removed unused getSocket

function CanvasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  console.log("DEBUG Board:", Board);


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const socket = connectSocket(token);

    // ✅ join the canvas room
    console.log('🚪 Joining canvas room:', id);
    socket.emit("joinCanvas", { canvasId: id });
    
    // Add timeout to check if join was successful
    setTimeout(() => {
      console.log('🔍 Socket room check after 2s:', {
        socketId: socket.id,
        connected: socket.connected,
        canvasId: id
      });
    }, 2000);

    // ✅ when server confirms & sends canvas
    socket.on("loadCanvas", (data) => {
      if (!data.success) {
        setError(data.message || "Not authorized to access this canvas");
        navigate("/profile");
        return;
      }

      const processed = processElements(data.canvas.elements || []);
      setCanvas({ ...data.canvas, elements: processed });
      setLoading(false);
      console.log('🎨 Canvas elements loaded via socket:', processed.length, 'elements');
    });

    // ✅ listen for real-time updates
    socket.on("canvasUpdated", (data) => {
      if (data.canvasId === id) {
        const processed = processElements(data.elements || []);
        setCanvas((prev) => ({ ...prev, elements: processed }));
      }
    });

    const fetchCanvas = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/canvas/load/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch canvas");

        const data = await response.json();
        if (!data.success)
          throw new Error(data.message || "Failed to load canvas");

        const processed = processElements(data.canvas.elements || []);
        setCanvas({ ...data.canvas, elements: processed });
        console.log('🎨 Canvas elements loaded via HTTP:', processed.length, 'elements');
      } catch (err) {
        setError(err.message);
        console.error("Error loading canvas:", err);
      } finally {
        setLoading(false);
      }
    };

    // fallback fetch if socket doesn’t send
    const timeout = setTimeout(() => {
      if (!canvas) fetchCanvas();
    }, 1500);

    return () => {
      clearTimeout(timeout);
      socket.off("loadCanvas");
      socket.off("canvasUpdated");
      disconnectSocket();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, token]); // ✅ removed "canvas" from deps to prevent infinite loop

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">Loading...</div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!canvas)
    return (
      <div className="flex items-center justify-center h-screen">
        No canvas found
      </div>
    );

  const initialElements = canvas?.elements || [];

  return (
    <BoardProvider
      key={canvas._id} // Force re-mount when canvas changes
      canvasId={canvas._id}
      initialElements={initialElements}
      token={token}
    >
      <ToolboxProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}

// 🔹 helper to normalize elements (brush, line, text, etc.)
function processElements(elements) {
  return elements.map((el) => {
    switch (el.type) {
      case TOOL_ITEMS.BRUSH:
        if (el.points && el.points.length > 0) {
          const stroke = getStroke(el.points, {
            size: el.size || 5,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
          });
          return { 
            ...el, 
            path: new Path2D(getSvgPathFromStroke(stroke)),
            size: el.size || 5 // Ensure size is always set
          };
        }
        return el;
      case TOOL_ITEMS.LINE:
      case TOOL_ITEMS.RECTANGLE:
      case TOOL_ITEMS.CIRCLE:
      case TOOL_ITEMS.ARROW:
        return {
          ...el,
          x1: el.x1 || 0,
          y1: el.y1 || 0,
          x2: el.x2 || 0,
          y2: el.y2 || 0,
          stroke: el.stroke || "#000",
          fill: el.fill,
          size: el.size || 1,
        };
      case TOOL_ITEMS.TEXT:
        return {
          ...el,
          text: el.text || "",
          x1: el.x1 || 0,
          y1: el.y1 || 0,
          stroke: el.stroke || "#000",
          size: el.size || 16,
        };
      default:
        return el;
    }
  });
}

export default CanvasPage;
