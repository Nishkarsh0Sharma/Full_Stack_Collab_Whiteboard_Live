const express = require('express');
const {
  createCanvas,
  getAllCanvases,
  loadCanvas,
  updateCanvas,
  deleteCanvas,
  shareCanvas,
} = require('../controller/canvasController');

const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Get all canvases
router.get('/', authenticateToken, getAllCanvases);

// Create a new canvas
router.post('/', authenticateToken, createCanvas);

// Load a specific canvas by ID
router.get('/load/:id', authenticateToken, loadCanvas);

// Update a canvas by ID
router.put('/:id', authenticateToken, updateCanvas);

// Delete a canvas by ID
router.delete('/:id', authenticateToken, deleteCanvas);

// Share a canvas with another user
router.put('/share/:id', authenticateToken, shareCanvas);

module.exports = router;
