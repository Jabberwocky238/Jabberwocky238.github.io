import { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';

const _CSS: CSSProperties = {
    alignItems: 'center',
    justifyContent: 'center',
}

function Home() {
    return (
        <div style={_CSS}>
            <img src="/logo.svg" className="App-logo" alt="logo" /><br />
            <NavLink to="/">Home</NavLink><br />
            <NavLink to="/document/papers/FastV.md">FastV.md</NavLink><br />
            <NavLink to="/document/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md">Adapter Tuning.md</NavLink><br />
            <br />
        </div>
    );
}

export default Home;
