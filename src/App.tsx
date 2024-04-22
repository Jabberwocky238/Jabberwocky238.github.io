import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DocDashboard from './routes/DocDashboard'
import Home from './routes/Home'
// import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/document/*" element={<DocDashboard />}></Route>
          <Route path="*" element={<DocDashboard/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
