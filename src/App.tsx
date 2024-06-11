import { HashRouter, Routes, Route } from 'react-router-dom';
import { Component } from 'react';

import Stage from './routes/Bird/Stage';
import DocDashboard from './routes/Doc/DocDashboard'
import Home from './routes/Home/Home'
import NotFound from './routes/NotFound'
import Graph from './routes/Graph/Graph';

class App extends Component {
  render() {
    console.log("App render")
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/document/*" element={<DocDashboard />}></Route>
            <Route path="/bird" element={<Stage />}></Route>
            <Route path="/graph" element={<Graph />}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </HashRouter>
      </div>
    );
  }
}

export default App;
