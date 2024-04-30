// import { NavLink } from 'react-router-dom';
import Card from '@/routes/Home/Card';
import './_style.css'

function Home() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <img src="/logo.svg" className="App-logo" alt="logo" />
            <div className='grid'>
                <Card title="Home" 
                    href="/#/" 
                    subtitle="主页" />
                <Card title="Notes" 
                    href="/#/document/papers/FastV.md"
                    subtitle="Obsidian Like Document" />
            </div>
        </div>
    );
}

export default Home;
