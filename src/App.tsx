import { HashRouter, Routes, Route } from 'react-router-dom';
import DocDashboard from './routes/Doc/DocDashboard'
import Home from './routes/Home'
import NotFound from './routes/NotFound'
import { Component } from 'react';

class App extends Component {
  render() {
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
}

export default App;
