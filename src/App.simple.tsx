import React from 'react';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Regalytics UI - Simple Test</h1>
      <p>If you can see this, the basic React app is working.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>Status Check:</h2>
        <ul>
          <li>✅ React is working</li>
          <li>✅ Basic rendering is working</li>
          <li>✅ CSS is working</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
