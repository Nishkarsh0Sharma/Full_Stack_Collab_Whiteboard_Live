// Configuration from environment variables
export const config = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3030',
    FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
    TOKEN_KEY: process.env.REACT_APP_TOKEN_KEY || 'token',
    CANVAS_SAVE_DELAY: parseInt(process.env.REACT_APP_CANVAS_SAVE_DELAY || '1000', 10)
};

// API endpoints
export const endpoints = {
    login: `${config.API_URL}/users/login`,
    profile: `${config.API_URL}/users/profile`,
    canvas: `${config.API_URL}/canvas`,
    canvasById: (id) => `${config.API_URL}/canvas/${id}`
};
