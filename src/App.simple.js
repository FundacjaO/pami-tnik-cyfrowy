import React from 'react';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test React App</h1>
      <p>Jeśli widzisz ten tekst, React działa poprawnie.</p>
      <button style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
        Test Button
      </button>
    </div>
  );
}

export default SimpleApp;
