import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import React, { useReducer, useCallback, useEffect, useState } from "react";
import {
  createElement,
  getSvgPathFromStroke,
  isPointNearElement,
} from "../utils/element";
import { getStroke } from "perfect-freehand";
import { getSocket } from "../utils/socket";

const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }

    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.actionType,
      };
    }

    case BOARD_ACTIONS.DRAW_DOWN: {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newElements = createElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke, fill, size }
      );
      const prevElements = state.elements;
      return {
        ...state,
        toolActionType:
          state.activeToolItem === TOOL_ITEMS.TEXT
            ? TOOL_ACTION_TYPES.WRITING
            : TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElements, newElements],
      };
    }

    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements];
      const index = state.elements.length - 1;
      const { type } = newElements[index];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW: {
          const { x1, y1, stroke, fill, size } = newElements[index];
          const newElement = createElement(index, x1, y1, clientX, clientY, {
            type: state.activeToolItem,
            stroke,
            fill,
            size,
          });
          newElements[index] = newElement;
          return {
            ...state,
            elements: newElements,
          };
        }

        case TOOL_ITEMS.BRUSH: {
          newElements[index].points = [
            ...newElements[index].points,
            { x: clientX, y: clientY },
          ];
          const brushSize = newElements[index].size || 5;
          newElements[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElements[index].points, { size: brushSize }))
          );
          return {
            ...state,
            elements: newElements,
          };
        }

        case TOOL_ITEMS.ERASER: {
          return state;
        }

        default:
          throw new Error(`Unknown tool type: ${type}`);
      }
    }

    case BOARD_ACTIONS.DRAW_UP: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(elementsCopy);
      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }

    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let newElements = [...state.elements];
      newElements = newElements.filter((element) => {
        return !isPointNearElement(element, clientX, clientY);
      });
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      return {
        ...state,
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }

    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.elements.length - 1;
      const newElements = [...state.elements];
      newElements[index].text = action.payload.text;

      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }

    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state;
      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }

    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;
      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
      };
    }

    // 🚀 new action to set elements from server
    case "SET_ELEMENTS_FROM_SERVER": {
      return {
        ...state,
        elements: action.payload.elements,
        history: [action.payload.elements],
        index: 0,
      };
    }

    default:
      return state;
  }
};

const createInitialBoardState = (initialElements = []) => ({
  activeToolItem: TOOL_ITEMS.BRUSH,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: initialElements,
  history: [initialElements],
  index: 0,
});

const BoardProvider = ({ children, initialElements, canvasId, token }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    createInitialBoardState(initialElements)
  );

  // State for controlling when to emit socket updates
  const [shouldEmitUpdate, setShouldEmitUpdate] = useState(false);

  // 🚀 function to set elements from server - MOVED UP to avoid hoisting issues
  const setElementsFromServer = useCallback((elements) => {
    console.log('📥 setElementsFromServer called with:', elements?.length || 0, 'elements');
    dispatchBoardAction({
      type: "SET_ELEMENTS_FROM_SERVER",
      payload: { elements: elements || [] },
    });
  }, []);

  // Update board state when initialElements change
  useEffect(() => {
    console.log('🔄 BoardProvider received initialElements:', initialElements?.length || 0);
    if (initialElements) {
      setElementsFromServer(initialElements);
    }
  }, [initialElements, setElementsFromServer]);

  // Force a state update to trigger re-render
  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      console.log('🚀 Forcing board re-render for initial elements');
      // Force re-render by updating a dummy state
      setElementsFromServer(initialElements);
    }
  }, [initialElements, setElementsFromServer]);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      },
    });
  };

  const boardMouseDownHandler = (event, toolboxState) => {
    const socket = getSocket();
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event;
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }

    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });

    // Emit start of drawing for BRUSH only (for smoother real-time)
    if (socket && boardState.activeToolItem === TOOL_ITEMS.BRUSH) {
      socket.emit("drawing", {
        canvasId,
        drawingData: {
          type: TOOL_ITEMS.BRUSH,
          start: { x: clientX, y: clientY },
          stroke: toolboxState[boardState.activeToolItem]?.stroke,
          size: toolboxState[boardState.activeToolItem]?.size || 5,
        },
      });
    }
  };

  const boardMouseMoveHandler = (event) => {
    const socket = getSocket();
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });

      // Emit brush points for real-time drawing
      if (socket && boardState.activeToolItem === TOOL_ITEMS.BRUSH) {
        socket.emit("drawing", {
          canvasId,
          drawingData: {
            type: TOOL_ITEMS.BRUSH,
            point: { x: clientX, y: clientY },
          },
        });
      }
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
      
      // Emit real-time erasing for other users to see
      if (socket) {
        socket.emit("drawing", {
          canvasId,
          drawingData: {
            type: 'ERASER',
            point: { x: clientX, y: clientY },
          },
        });
      }
    }
  };


  const boardMouseUpHandler = () => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      });
      // Set flag to emit update after state is updated
      setShouldEmitUpdate(true);
      console.log('🎨 Drawing finished - will emit canvas update');
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      // IMPORTANT: Erasing also needs to trigger socket updates!
      setShouldEmitUpdate(true);
      console.log('🧽 Erasing finished - will emit canvas update');
    }
    
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
    });
  };

  // Emit updateCanvas when elements change after drawing
  useEffect(() => {
    if (shouldEmitUpdate && canvasId) {
      const socket = getSocket();
      console.log('🔌 Socket status:', {
        socketExists: !!socket,
        socketConnected: socket?.connected,
        socketId: socket?.id,
        canvasId,
        elementsCount: boardState.elements.length,
        elements: boardState.elements
      });
      
      if (socket && socket.connected) {
        console.log('📡 Emitting updateCanvas event:', {
          canvasId,
          elementsCount: boardState.elements.length,
          action: boardState.toolActionType === TOOL_ACTION_TYPES.ERASING ? 'ERASE' : 'DRAW',
          firstElement: boardState.elements[0],
          lastElement: boardState.elements[boardState.elements.length - 1]
        });
        
        socket.emit("updateCanvas", {
          canvasId,
          elements: boardState.elements,
        }, (response) => {
          console.log('📨 UpdateCanvas acknowledgment:', response);
        });
      } else {
        console.error('⚠️ Socket not connected! Cannot emit updateCanvas', {
          socketExists: !!socket,
          connected: socket?.connected,
          canvasId
        });
      }
      setShouldEmitUpdate(false);
    }
  }, [boardState.elements, shouldEmitUpdate, canvasId]);

  const textAreaBlurHandler = (text) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
    // Set flag to emit update after text is added
    setShouldEmitUpdate(true);
  };

  const boardUndoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
    // Trigger socket update after undo
    setShouldEmitUpdate(true);
    console.log('↩️ Undo operation - will emit canvas update');
  }, []);

  const boardRedoHandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
    // Trigger socket update after redo
    setShouldEmitUpdate(true);
    console.log('↪️ Redo operation - will emit canvas update');
  }, []);


  // Setup WebSocket event listeners for real-time collaboration
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !canvasId) return;

    // Listen for canvas updates from other users
    const handleCanvasUpdated = (data) => {
      console.log('🔄 Received canvasUpdated event:', data);
      if (data.canvasId === canvasId) {
        console.log('📝 Updating elements from other user:', data.elements?.length || 0);
        setElementsFromServer(data.elements || []);
      }
    };

    // Listen for real-time drawing from other users
    const handleUserDrawing = (data) => {
      console.log("Real-time drawing from user:", data.userId, data.drawingData);
      // You can add visual indicators for other users' cursors here
    };

    // Listen for user presence events
    const handleUserJoined = (data) => {
      console.log("User joined:", data.userId);
    };

    const handleUserLeft = (data) => {
      console.log("User left:", data.userId);
    };

    // Register event listeners with error handling
    socket.on("canvasUpdated", handleCanvasUpdated);
    socket.on("userDrawing", handleUserDrawing);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);
    
    // Listen for errors
    socket.on("error", (error) => {
      console.error('😨 Socket error:', error);
    });
    
    console.log('👂 WebSocket event listeners registered for canvas:', canvasId);

    // Cleanup event listeners
    return () => {
      socket.off("canvasUpdated", handleCanvasUpdated);
      socket.off("userDrawing", handleUserDrawing);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
    };
  }, [canvasId, setElementsFromServer]);

  const boardContextValue = {
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
    setElementsFromServer, // exposed for socket
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
