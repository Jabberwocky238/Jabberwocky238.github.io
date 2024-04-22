import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DocDashboard from './routes/DocDashboard'
import Home from './routes/Home'
import { useState } from 'react';

function App() {
  // const [counter, setCounter] = useState(0)
  return (
    <div className="App">
        {/* <button onClick={() => setCounter(counter + 1)}>dfghjk</button>
        {counter} */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/document/*" element={<DocDashboard />}></Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
