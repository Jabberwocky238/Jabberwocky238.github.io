import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DocDashboard from './routes/DocDashboard'
import { useState } from 'react';

function App() {
  const [counter, setCounter] = useState(0)
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => setCounter(counter + 1)}>dfghjk</button>
        {counter}
        <Router><br />
          <Link to="/document/papers/FastV.md">FastV.md</Link><br />
          <Link to="/document/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md">Adapter Tuning.md</Link><br />
          <Link to="/home/news">嵌套</Link><br />
          <Routes>
            <Route path="/document/*" element={<DocDashboard />}></Route>
          </Routes>
        </Router>
        <br />
      </header>
    </div>
  );
}

export default App;
