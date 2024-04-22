import logo from '../logo.svg';
import { NavLink } from 'react-router-dom';

function Home() {
    return (
        <>
            <img src={logo} className="App-logo" alt="logo" />
            <NavLink className="App-link" to="/">Home</NavLink><br />
            <NavLink className="App-link" to="/document/papers/FastV.md">FastV.md</NavLink><br />
            <NavLink className="App-link" to="/document/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md">Adapter Tuning.md</NavLink><br />
            <br />
        </>
    );
}

export default Home;
