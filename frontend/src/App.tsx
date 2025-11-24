import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TodoList from "./components/TodoList";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [view, setView] = useState<"login" | "register">("login");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  if (!token) {
    return (
      <div className="app">
        <h1>Todo App</h1>
        {view === "login" ? (
          <Login setToken={setToken} setView={setView} />
        ) : (
          <Register setToken={setToken} setView={setView} />
        )}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, logout }}>
      <div className="app">
        <header>
          <h1>Todo App</h1>
          <button onClick={logout}>Logout</button>
        </header>
        <TodoList />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
