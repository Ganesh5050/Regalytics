import React from "react";

const App = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test App - Working!</h1>
      <p>If you can see this, the React app is working.</p>
      <div style={{ 
        background: "#f0f0f0", 
        padding: "20px", 
        borderRadius: "8px",
        marginTop: "20px"
      }}>
        <h2>Debug Info:</h2>
        <p>✅ React is rendering</p>
        <p>✅ Vite dev server is working</p>
        <p>✅ Browser is loading the app</p>
      </div>
    </div>
  );
};

export default App;