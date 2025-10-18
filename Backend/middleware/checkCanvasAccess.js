const Canvas = require("../models/canvasModel");

// Higher-order middleware for canvas access check
function checkCanvasAccess(handler) {
  return async (socket, payload = {}) => {
    try {
      const { canvasId, ...data } = payload;

      if (!canvasId) {
        socket.emit("error", { message: "CanvasId is required" });
        return;
      }

      const foundCanvas = await Canvas.findById(canvasId)
        .populate('owner', '_id email')
        .populate('shared_with', '_id email');
      if (!foundCanvas) {
        socket.emit("error", { message: "Canvas not found" });
        return;
      }

      const email = socket.user.email;
      const userId = socket.user.id;
      
      // Handle both populated and non-populated owner field
      const canvasOwnerId = foundCanvas.owner?._id ? 
        foundCanvas.owner._id.toString() : 
        foundCanvas.owner.toString();
      
      // Handle both populated and non-populated shared_with field
      const sharedUserIds = foundCanvas.shared_with?.map(user => 
        user._id ? user._id.toString() : user.toString()
      ) || [];
      
      const isOwner = canvasOwnerId === userId;
      const isShared = sharedUserIds.includes(userId);

      console.log(`🔐 Canvas access check for ${email}:`, {
        userId,
        canvasId,
        canvasOwnerId,
        isOwner,
        sharedUserIds,
        isShared,
        hasSharedWith: !!foundCanvas.shared_with,
        sharedWithLength: foundCanvas.shared_with?.length || 0
      });

      if (!isOwner && !isShared) {
        console.log(`❌ Access denied for ${email} to canvas ${canvasId}`);
        console.log('Debug info:', {
          userIdType: typeof userId,
          ownerIdType: typeof canvasOwnerId,
          userIdLength: userId?.length,
          ownerIdLength: canvasOwnerId?.length,
          strictEqual: canvasOwnerId === userId,
          looseEqual: canvasOwnerId == userId
        });
        socket.emit("error", { message: "Not authorized for this canvas" });
        return;
      }

      console.log(`✅ Access granted for ${email} to canvas ${canvasId}`);

      // ✅ Access granted → call the real handler
      await handler(socket, { canvasId, foundCanvas, ...data });
    } catch (err) {
      console.error("Canvas access check failed:", err.message);
      if (socket && socket.emit) {
        socket.emit("error", { message: "Server error" });
      }
    }
  };
}

module.exports = checkCanvasAccess;
