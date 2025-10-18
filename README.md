# 🎨 Interactive Whiteboard Application

A full-stack collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables real-time drawing, collaboration, and user authentication.

![Whiteboard Demo](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen) ![Socket.io](https://img.shields.io/badge/Socket.io-4.x-orange) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue)

## 🌟 Features

### 🎨 Drawing Tools & Canvas Features
- Rich set of drawing tools: Brush, Line, Rectangle, Circle, Arrow, and Text
- Real-time collaborative drawing with Socket.io
- Customizable brush sizes and colors
- Smart eraser tool with shape detection
- Undo/Redo functionality
- Export canvas as image

### 👥 User Management & Authentication
- Secure user registration and login system
- JWT-based authentication
- Personal profile management
- Canvas access control and sharing
- Saved canvas history

### 💻 Technical Features
- Real-time collaboration using Socket.io
- MongoDB for persistent storage
- RESTful API architecture
- JWT-based authentication middleware
- Responsive design with TailwindCSS
- Canvas element manipulation and rendering
- WebSocket-based live updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB instance
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/whiteboard.git
cd whiteboard
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../Frontend/WHITEBOARD-APPLICATION
npm install
```

4. Set up environment variables:
Create .env files in both Backend and Frontend directories with necessary configurations.

5. Start the application:
```bash
# Start Backend (from Backend directory)
npm start

# Start Frontend (from Frontend/WHITEBOARD-APPLICATION directory)
npm start
```

Visit http://localhost:3000 to access the application.

## 🏗️ Architecture

### Frontend Structure
```
Frontend/
└── WHITEBOARD-APPLICATION/
    ├── src/
    │   ├── components/           # Reusable UI components
    │   │   ├── Board/           # Canvas and drawing logic
    │   │   ├── Toolbar/         # Drawing tools interface
    │   │   └── Toolbox/         # Color and size controls
    │   ├── pages/               # Main application pages
    │   ├── store/               # Context providers and state
    │   └── utils/               # Helper functions
    └── public/                  # Static assets
```

### Backend Structure
```
Backend/
├── controller/                  # Request handlers
├── middleware/                  # Auth and access control
├── models/                     # MongoDB schemas
└── routes/                     # API endpoints
```

## 🔧 Technologies Used

### Frontend
- React.js for UI components
- Socket.io-client for real-time updates
- TailwindCSS for styling
- HTML5 Canvas API for drawing
- Context API for state management

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for WebSocket connections
- JWT for authentication
- Express middleware for routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name]

