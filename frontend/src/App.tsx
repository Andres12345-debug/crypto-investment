import React from 'react';
import './App.css';
import { RuteoPrincipal } from './routes/RuteoPrincipal';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <RuteoPrincipal />
      </div>
    </BrowserRouter>
  );
}

export default App;
