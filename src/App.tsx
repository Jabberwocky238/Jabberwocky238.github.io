import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import DocDashboard from './routes/DocDashboard'
import Home from './routes/Home'

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/document/*" element={<DocDashboard />}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
