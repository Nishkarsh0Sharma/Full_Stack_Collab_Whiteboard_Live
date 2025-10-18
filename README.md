# 🎨 Collaborative Whiteboard Application

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen) ![Socket.io](https://img.shields.io/badge/Socket.io-4.x-orange) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

## 📖 Introduction

Welcome to the Collaborative Whiteboard Application, a powerful full-stack MERN application that revolutionizes real-time collaborative drawing and brainstorming. Built with modern web technologies, this platform offers a seamless digital canvas experience with real-time collaboration, robust user authentication, and intuitive drawing tools.

Perfect for remote teams, educators, and creative professionals who need a reliable platform for visual collaboration and ideation!

## ✨ Key Features

### 🎨 **Drawing & Collaboration Tools**
- **🖌️ Real-time Drawing**: Synchronized drawing experience with instant updates across all connected users
- **📏 Shape Tools**: Precise drawing tools including line, rectangle, circle, and arrow tools
- **✍️ Freehand Tool**: Smooth freehand drawing with pressure sensitivity
- **📝 Text Tool**: Add and edit text annotations in real-time
- **🧹 Smart Eraser**: Intelligent shape and stroke detection for precise erasing
- **↩️ Undo/Redo**: Comprehensive history management for all actions

### � **Security & User Management**
- **👤 User Authentication**: Secure registration and login system using JWT tokens
- **🔒 Protected Routes**: Role-based access control for canvas and user management
- **👥 Profile Management**: Personalized user profiles with saved preferences
- **🤝 Collaboration Control**: Fine-grained access control for shared canvases
- **📊 Session Management**: Robust token-based session handling

### ⚡ **Technical Excellence**
- **🔄 WebSocket Integration**: Real-time updates using Socket.io
- **🗄️ MongoDB Architecture**: Efficient data storage and retrieval
- **🛡️ Secure API**: RESTful API with JWT authentication
- **📱 Responsive Design**: Seamless experience across all devices
- **🎨 Modern UI**: Clean interface styled with TailwindCSS
- **⚡ Optimized Performance**: Efficient canvas rendering and state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB instance
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nishkarsh0Sharma/Full_Stack_Collab_Whiteboard_Live.git
cd Full_Stack_Collab_Whiteboard_Live
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

```
FULL-STACK-WHITEBOARD/
├── Backend/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── Frontend/
│   └── WHITEBOARD-APPLICATION/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   │   └── Register.js
│       │   ├── store/
│       │   ├── App.js
│       │   └── index.js
│       ├── package.json
│       ├── .env
│       └── .env.example
└── README.md
```

### 🏗️ Architectural Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│                                                            │
│    ┌──────────────┐   ┌───────────────┐   ┌──────────┐    │
│    │   Canvas     │   │    Toolbar    │   │ Toolbox  │    │
│    │  Component   │◄──┤   Component   │◄──┤Component │    │
│    └──────┬───────┘   └───────────────┘   └──────────┘    │
│           │                    ▲                           │
│           │                    │                           │
│    ┌──────▼──────┐     ┌──────┴──────┐    ┌──────────┐   │
│    │   Board     │     │   Toolbox   │    │   Auth   │   │
│    │  Context    │     │   Context   │    │ Context  │   │
│    └──────┬──────┘     └────────────┘    └────┬─────┘   │
│           │                                    │         │
└───────────┼────────────────────────────────────┼─────────┘
            │                                    │
            ▼                                    ▼
┌──────────────────────────────────────────────────────────┐
│                      WebSocket & HTTP                     │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                        Backend                            │
│                                                          │
│    ┌──────────────┐   ┌───────────────┐   ┌──────────┐  │
│    │    Canvas    │   │     User      │   │  Token   │  │
│    │ Controller   │   │  Controller   │   │ Manager  │  │
│    └──────┬───────┘   └───────┬───────┘   └────┬────┘  │
│           │                   │                 │       │
│    ┌──────▼───────┐   ┌──────▼──────┐   ┌────▼────┐  │
│    │    Canvas    │   │    User     │   │  Token   │  │
│    │    Model     │   │    Model    │   │  Model   │  │
│    └──────────────┘   └────────────┘   └─────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Key Components Interaction:

1. **Frontend-Backend Communication**:
   - RESTful API calls for CRUD operations
   - WebSocket connections for real-time updates
   - JWT-based authentication for secure communication

2. **State Management**:
   - Context API for global state management
   - Real-time sync between multiple users
   - Optimistic updates for better UX

3. **Data Flow**:
   - Canvas events → Board Context → WebSocket → Server
   - Server → WebSocket → Board Context → Canvas Update
   - User Actions → Auth Context → API → Token Management

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

Made with ❤️ by [Nishkarsh Sharma](https://github.com/Nishkarsh0Sharma)

