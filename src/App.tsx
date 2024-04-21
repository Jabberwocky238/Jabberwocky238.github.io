import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams, setSearchParms] = useSearchParams();
  const [html, setHtml] = React.useState('')
  fetch('http://localhost:3000/markdown/papers/FastV.md')
  .then(res => res.text())
  .then(text => {
    setHtml(text)
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        {html}
        </p>
        <a
          className="App-link"
          href="document/强化学习：PPO （Proximal Policy Optimization）的来龙去脉.md"
          target="_self"
          rel="noopener noreferrer"
        >
          操
        </a>
        <a
          className="App-link"
          href="document/papers/FastV.md"
          target="_self"
          rel="noopener noreferrer"
        >
          操s
        </a>
      </header>
    </div>
  );
}

export default App;
