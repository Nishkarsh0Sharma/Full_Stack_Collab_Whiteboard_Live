// import Board from "./components/Board";
// import Toolbar from "./components/Toolbar";
// import Toolbox from "./components/Toolbox";
// import BoardProvider from "./store/BoardProvider";
// import ToolboxProvider from "./store/ToolboxProvider";

// function App() {
//   return (
//     <BoardProvider>
//       <ToolboxProvider>
//         <Toolbar />
//         <Board />
//         <Toolbox />
//       </ToolboxProvider>
//     </BoardProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./store/auth-context";
import { useContext } from "react";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import CanvasPage from "./pages/Canvas";

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/canvas/:id" 
            element={
              <ProtectedRoute>
                <CanvasPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/profile" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
