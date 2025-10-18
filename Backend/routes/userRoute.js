const {registerUser , loginUser , getUserProfile ,refreshAccessToken , logoutUser } = require('../controller/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = require('express').Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logoutUser);

module.exports = router;