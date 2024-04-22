import { HashRouter, Routes, Route } from 'react-router-dom';
import DocDashboard from './routes/DocDashboard'
import Home from './routes/Home'
import NotFound from './routes/NotFound'

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/"  element={<Home />}></Route>
          <Route path="/document/*" element={<DocDashboard />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
