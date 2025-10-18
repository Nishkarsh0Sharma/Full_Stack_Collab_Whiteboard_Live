const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const Token = require('../models/tokenModel');

// utility to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { email: user.email },
        JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
        { email: user.email },
        JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );

    return { accessToken, refreshToken };
};

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.register(name, email, password);

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token in DB with userId
        await Token.create({ 
            refreshToken,
            userId: user._id
        });

        // securing password
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: safeUser, // return user data without password
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // call static login method from User model
        const user = await userModel.login(email, password);

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token in DB with userId
        await Token.create({ 
            refreshToken,
            userId: user._id
        });

        // Store refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.COOKIE_SAME_SITE || "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        // 1. Extract token from Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Extract email from payload
        const { email } = decoded;

        // 4. Get user profile using your model method
        const user = await userModel.getUsers(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 5. Return user profile (omit password)
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.status(200).json({
            message: 'Profile fetched successfully',
            user: safeUser
        });

    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token: ' + error.message });
    }
};


// Refresh access token controller
const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        // Check if refresh token exists
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        // Verify refresh token from DB
        const tokenInDB = await Token.findOne({ refreshToken });
        if (!tokenInDB) {
            return res.status(403).json({ error: 'Refresh token not recognized' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        
        // Find user to ensure they still exist
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            // Remove invalid token from database
            await Token.deleteOne({ refreshToken });
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { email: decoded.email },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Optionally rotate refresh token for better security
        const newRefreshToken = jwt.sign(
            { email: decoded.email },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Update refresh token in database
        await Token.findOneAndUpdate(
            { refreshToken },
            { refreshToken: newRefreshToken },
            { new: true }
        );

        // Update refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only HTTPS in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: 'Access token refreshed',
            accessToken
        });
    } catch (error) {
        // If refresh token is invalid, remove it from database
        if (req.cookies.refreshToken) {
            await Token.deleteOne({ refreshToken: req.cookies.refreshToken });
        }
        res.clearCookie("refreshToken");
        res.status(403).json({ error: 'Invalid refresh token: ' + error.message });
    }
};


// Logout controller
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    // Remove token from DB
    await Token.deleteOne({ refreshToken });

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    refreshAccessToken,
    logoutUser
};
