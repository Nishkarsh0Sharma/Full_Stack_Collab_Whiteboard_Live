const Canvas = require("../models/canvasModel");

 //Get all canvases for a user noth owned and shared with
const getAllCanvases = async (req, res) => { 
    const email = req.user.email;
    try {
        const canvases = await Canvas.getAllCanvases(email);
        res.status(200).json({
            success: true,
            count: canvases.length,
            canvases: canvases
        }); 
    } catch(error) {
        // Handle specific errors
        if (error.message.includes('User not found')) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving canvases',
            error: error.message 
        });
    }
}

// Create a new canvas for the authenticated user
const createCanvas = async (req, res) => {
    const email = req.user.email;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ 
            success: false,
            message: 'Canvas name is required' 
        });
    }

    try {
        const newCanvas = await Canvas.createCanvas(email, name);
        res.status(201).json({
            success: true,
            canvas: newCanvas
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error creating canvas',
            error: error.message 
        });
    }
};

const loadCanvas = async (req, res) => {
    const email = req.user.email;
    const id = req.params.id;

    try {
        const canvas = await Canvas.loadCanvas(email , id);
        res.status(200).json({
            success: true,
            canvas: canvas
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCanvas = async(req,res)=>{
    const email = req.user.email;
    const id = req.params.id;
    const { elements } = req.body;
    
    if (!elements) {
        return res.status(400).json({ 
            success: false,
            message: 'Canvas elements are required' 
        });
    }

    try {
        const updatedCanvas = await Canvas.updateCanvas(email, id, elements);
        res.status(200).json({
            success: true,
            canvas: updatedCanvas
        });

    } catch (error) {
        // Handle specific errors
        if (error.message.includes('User not found')) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        if (error.message.includes('Canvas not found')) {
            return res.status(404).json({ 
                success: false,
                message: 'Canvas not found' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error updating canvas',
            error: error.message 
        });
    }
};
 

const deleteCanvas = async (req, res) => {
  const email = req.user.email;   // from JWT middleware
  const id = req.params.id;

  try {
    await Canvas.deleteCanvas(email, id);

    return res.status(200).json({
      success: true,
      message: 'Canvas deleted successfully',
    });
  } catch (error) {
    // Handle ownership + not found cases clearly
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (error.message.includes('Canvas not found')) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this canvas',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error deleting canvas',
      error: error.message,
    });
  }
};

const shareCanvas = async (req, res) => {
    const ownerEmail = req.user.email; // from JWT middleware
    const canvasId = req.params.id;
    const { shareEmail } = req.body;
    
    if (!shareEmail) {
        return res.status(400).json({
        success: false,
        message: 'Email of the user to share with is required',
        });
    }
    
    try {
        await Canvas.shareCanvas(ownerEmail, canvasId, shareEmail);
    
        return res.status(200).json({
        success: true,
        message: `Canvas shared with ${shareEmail} successfully`,
        });
    } catch (error) {
        // Handle specific errors
        if (error.message.includes('Owner not found')) {
        return res.status(404).json({
            success: false,
            message: 'Owner not found',
        });
        }
    
        if (error.message.includes('User to share with not found')) {
        return res.status(404).json({
            success: false,
            message: 'User to share with not found',
        });
        }
    
        if (error.message.includes('Canvas not found')) {
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to share this canvas',
        });
        }
    
        if (error.message.includes('Canvas already shared')) {
        return res.status(400).json({
            success: false,
            message: 'Canvas already shared with this user',
        });
        }
    
        return res.status(500).json({
        success: false,
        message: 'Error sharing canvas',
        error: error.message,
        });
    }
};
    
module.exports = {
    getAllCanvases, 
    createCanvas,
    loadCanvas,
    updateCanvas,
    deleteCanvas,
    shareCanvas,
};